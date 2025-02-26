import { writeFile } from "fs/promises";
import path from "path";
import fs from "fs";

export const saveBase64Image = async (base64: string, dir: string, filename: string): Promise<string> => {
  try {
    const matches = base64.match(/^data:(image\/\w+);base64,(.+)$/);
    if (!matches) {
      throw new Error("Invalid base64 format");
    }

    const [, mimeType, base64Data] = matches;
    const extension = mimeType.split("/")[1];
    const filePath = path.join(process.cwd(), `public/${dir}`, `${filename}.${extension}`);

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const buffer = Buffer.from(base64Data, "base64");
    await writeFile(filePath, buffer);

    return filePath;
  } catch (error) {
    throw new Error(`Failed to save image: ${error.message}`);
  }
};
