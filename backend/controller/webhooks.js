const Stripe = require("stripe");
const prisma = require("../prismaClient");

const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

const stripeWebhooks = async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;

    try {
        // Construct the Stripe event using the raw body
        event = stripeInstance.webhooks.constructEvent(
            req.body, // Use raw body from express.raw()
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        console.error(`Webhook Error: ${err.message}`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    try {
        switch (event.type) {
            case "payment_intent.succeeded": {
                const paymentIntent = event.data.object;
                const paymentIntentId = paymentIntent.id;

                // Retrieve the session using the payment intent
                const sessions = await stripeInstance.checkout.sessions.list({
                    payment_intent: paymentIntentId,
                });

                if (!sessions.data || sessions.data.length === 0) {
                    console.error("No session found for payment intent");
                    break;
                }

                const session = sessions.data[0];
                const { purchaseId } = session.metadata;

                console.log(purchaseId);
                // Update purchase and create enrollment
                const purchaseData = await prisma.purchase.findFirst({
                    where: { id: purchaseId },
                });
                console.log(purchaseData);


                if (purchaseData) {
                    await prisma.enrollment.create({
                        data: {
                            userId: purchaseData.userId,
                            courseId: purchaseData.courseId,
                        },
                    });

                    await prisma.purchase.update({
                        where: { id: purchaseId },
                        data: { status: "completed" },
                    });

                    console.log(`Purchase ${purchaseId} marked as completed.`);
                }
                break;
            }

            case "payment_intent.payment_failed": {
                const paymentIntent = event.data.object;
                const paymentIntentId = paymentIntent.id;

                const sessions = await stripeInstance.checkout.sessions.list({
                    payment_intent: paymentIntentId,
                });

                if (!sessions.data || sessions.data.length === 0) {
                    console.error("No session found for failed payment intent");
                    break;
                }

                const session = sessions.data[0];
                const { purchaseId } = session.metadata;

                await prisma.purchase.update({
                    where: { id: purchaseId },
                    data: { status: "failed" },
                });

                console.log(`Purchase ${purchaseId} marked as failed.`);
                break;
            }

            default:
                console.log(`Unhandled event type: ${event.type}`);
        }

        // Send acknowledgment to Stripe
        res.json({ received: true });
    } catch (error) {
        console.error("Error processing webhook:", error.message);
        res.status(500).send("Internal Server Error");
    }
};

module.exports = stripeWebhooks;
