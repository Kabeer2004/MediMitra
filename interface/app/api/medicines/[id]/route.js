import connect from "@utils/db"; // Ensure this connects to your MongoDB
import Medicine from "@models/medecine"; // Adjust the import according to your model
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
    await connect();

    const { id } = params; // Get the family member id from the URL

    try {
        // Find medicines associated with the family member
        const medicines = await Medicine.find({ family_member_id: id }); // Adjust to match your schema

        // If no medicines found, return a 404 response
        if (!medicines.length) {
            return new NextResponse("No medicines found for this member", { status: 404 });
        }

        return NextResponse.json(medicines, { status: 200 });
    } catch (error) {
        return new NextResponse(
            JSON.stringify({ message: "Error fetching medicines", error: error.message }),
            { status: 500 }
        );
    }
}
