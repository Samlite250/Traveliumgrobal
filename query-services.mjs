import fs from 'fs';

const PROJECT_ID = 'traveliumgrobal-808bc';

const API_KEY = 'AIzaSyAN_4AsWe4jxeIb3kkjpZItL3ynD2Ut3Xg';
async function main() {
    console.log("Fetching services from Firestore...");
    const url = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/services?key=${API_KEY}`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.documents) {
            console.log(`Found ${data.documents.length} services.`);
            data.documents.forEach((doc, idx) => {
                const fields = doc.fields || {};
                const name = fields.name?.stringValue || fields.title?.stringValue || 'Unnamed';
                const active = fields.active?.booleanValue ?? 'Not Set';
                console.log(`[${idx + 1}] ${name} - Active: ${active} - ID: ${doc.name.split('/').pop()}`);
            });
        } else {
            console.log("No services found or empty response.", data);
        }
    } catch (err) {
        console.error("Error fetching services:", err);
    }
}

main();
