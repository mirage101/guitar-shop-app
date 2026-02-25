import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
    try {
        const body = await request.json();
        const { totalAmount, userData } = body;

        if (!totalAmount || !userData) {
            return NextResponse.json(
                { error: "Missing required fields." },
                { status: 400 }
            )
        }

        const paymentIntent = await stripeInstance.paymentIntents.create({
            currency: "usd",
            amount: Number((totalAmount * 100).toFixed(2)),
            receipt_email: userData.email
        });

        return NextResponse.json(
            { clientSecret: paymentIntent.client_secret },
            { status: 200 }
        );

    } catch (error) {
        return NextResponse.json(
            { error: error.message || "Failed to create payment intent" },
            { status: 500 }
        );
    }
}