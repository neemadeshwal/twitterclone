export async function previewFile(imgFile: FileList) {
  console.log("imgfile --- > ", imgFile);
  const imgFormData = new FormData();
  Array.from(imgFile).forEach((file: File) => {
    console.log("inside file --/", file);

    if (file.size > 8388608) {
      return;
    }

    imgFormData.append("files", file);
  });
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL_API}/api/uploads/previewImages`,
      {
        method: "Post",
        body: imgFormData,
      }
    );
    const result = await response.json();

    return result.fileUrl;
  } catch (error) {
    console.log(error);
  }
}
