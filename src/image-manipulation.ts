import * as Jimp from "jimp";

function jimp2Buffer(jimpedInput: Jimp.Jimp): Promise<Buffer> {
	return new Promise((resolve, reject) => {
		jimpedInput.getBuffer(Jimp.MIME_JPEG, (err, output) => {
			if (err != null) {
				reject(err);
				return;
			}

			resolve(output);
		});
	});
}

export async function resize(input: Buffer, width?: number, height?: number) {
	if (!width && !height) {
		console.log("no width/height to scale :(");
		return input;
	}

	const image = await Jimp.read(input);
	image.resize(width || Jimp.AUTO, height || Jimp.AUTO);

	const output = await jimp2Buffer(image);

	return output;
}
