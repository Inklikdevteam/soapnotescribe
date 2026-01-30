import { createServerClient } from '@/utils/pocketbase/server';
import PDFDocument from 'pdfkit';
import { formatDateToLocal, formatTime } from '@/app/lib/utils';
import { fetchNoteById } from '@/app/lib/data';


export async function generateAndSavePdf(id: string) {  
  const note = await fetchNoteById(id)

  const appointmentTime = formatTime(note.appointment_time);


  const regularFontPath = 'app/ui/fonts/Inter-Regular.ttf'
  const boldFontPath = 'app/ui/fonts/Inter-Bold.ttf'

  const doc = new PDFDocument({ "font": 'app/ui/fonts/Inter-Regular.ttf' });

  doc.registerFont('bold', boldFontPath);
  doc.registerFont('regular', regularFontPath);

  doc.font('bold').text(`Patient name: `, {continued: true});
  doc.font('regular').text(`${note.patient.last_name}, ${note.patient.first_name} ${note.patient.middle_name? note.patient.middle_name: ''}`)
  // doc.moveDown();
  doc.font('bold').text(`Patient date of birth: `, {continued: true});
  doc.font('regular').text(`${note.patient.date_of_birth}`);
  doc.font('bold').text(`Patient age: `, {continued: true});
  doc.font('regular').text(`${note.patient_age_years} years old`);
  doc.font('bold').text(`Appointment Date: `, {continued: true});
  doc.font('regular').text(`${note.appointment_date}`);
  doc.font('bold').text(`Appointment Time: `, { continued: true });
  doc.font('regular').text(`${appointmentTime}`);
  doc.font('bold').text(`Appointment Type: `, {continued: true});
  doc.font('regular').text(`${note.appointment_type}`);
  doc.font('bold').text(`Appointment Specialty: `, {continued: true});
  doc.font('regular').text(`${note.appointment_specialty}`);
  doc.font('bold').text(`Patient is located in: `, {continued: true});
  doc.font('regular').text(`${note.patient_location}`);
  doc.font('bold').text(`Consent: `, { continued: true });
  doc.font('regular').text(`Patient consents to treatment`);
  doc.font('bold').text(`Allergies: `, { continued: true });
  doc.font('regular').text(`${note.allergies}`);
  doc.moveDown();
  doc.moveDown();
  doc.moveTo(0 + 50, doc.y)
    .lineTo(doc.page.width - 50, doc.y)
    .stroke();
  doc.moveDown();
  doc.moveDown();
  doc.font('bold').text(`Chief Complaint: `);
  doc.font('regular').text(`${note.chief_complaint}`);
  doc.moveDown();
  doc.font('bold').text(`Subjective: `);
  doc.font('regular').text(`${note.soap_subjective?.replace(/\r\n|\r/g, '\n')}`);
  doc.moveDown();
  doc.font('bold').text(`Objective: `);
  doc.font('regular').text(`${note.soap_objective?.replace(/\r\n|\r/g, '\n')}`);
  doc.moveDown();
  doc.font('bold').text(`Assessment: `);
  doc.font('regular').text(`${note.soap_assessment?.replace(/\r\n|\r/g, '\n')}`);
  doc.moveDown();
  doc.font('bold').text(`Plan: `);
  doc.font('regular').text(`${note.soap_plan?.replace(/\r\n|\r/g, '\n')}`);
  doc.moveDown();
  doc.moveDown();
  doc.font('bold').text(`Doctor Signature:`);
  doc.font('regular').text(`${note.doctor_signature}`); 

    const pdfBuffer: Buffer[] = []
    
     // Pipe the PDF document to the buffer
  doc.on('data', (chunk) => pdfBuffer.push(chunk));
  doc.on('end', async () => {
    // Concatenate the buffer chunks into a single buffer
    const pdfData = Buffer.concat(pdfBuffer);
    
    // Define the filename for the PDF
    const fileName = `${note.patient.last_name}_${note.patient.first_name}_${note.appointment_date}.pdf`;

    try {
      // Initialize PocketBase client
      const pb = createServerClient();

      // Create a File object from the buffer for PocketBase upload
      const pdfFile = new File([pdfData], fileName, { type: 'application/pdf' });

      // Update the note record with the PDF file
      // Note: This requires a 'pdf_file' field of type 'file' in the notes collection
      // For now, we'll just log success - file storage needs to be configured in PocketBase
      console.log('PDF generated successfully:', fileName);
      
      // If you have a file field in your notes collection, uncomment:
      // await pb.collection('notes').update(id, { pdf_file: pdfFile });
    } catch (error) {
      console.error('Error with PDF:', error);
      return;
    }

    console.log('PDF generated successfully');
  });

  // Finalize the PDF
  doc.end();
}