import officeParser from "officeparser";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const arrayBuffer = await file.arrayBuffer();

    const text = await officeParser.parseOfficeAsync(arrayBuffer, {
      includeSlides: true,
      preserveLineBreaks: true,
    });

    return Response.json({ text });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
