import {
	Storage as GoogleCloudStorage,
	type Storage,
} from '@google-cloud/storage';
import { default as ky } from 'ky-universal';

export const firebaseStorageClient = new GoogleCloudStorage({
	projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
	credentials: {
		client_email: process.env.GOOGLE_CLOUD_CLIENT_EMAIL,
		private_key: process.env.GOOGLE_CLOUD_PRIVATE_KEY?.replace(/\\n/g, '\n'),
	},
});

export const getFirebaseStorageContent = async (params: {
	bucketName: string;
	storageClient: Storage;
	storageUrl: string;
}): Promise<string> => {
	try {
		// Read file from Google Cloud Storage
		const storageFilePath = params.storageUrl.split('.appspot.com/')?.[1] || '';
		const file = params.storageClient
			.bucket(params.bucketName)
			.file(storageFilePath);
		const [contents] = await file.download();

		// Convert contents to a string
		const content = contents.toString('utf8');
		return content;
	} catch (err) {
		console.log(err);
		return Promise.reject(err);
	}
};

export const getLocalStorageContent = async (params: {
	bucketName: string;
	storageUrl: string;
}): Promise<string> => {
	try {
		const cdnUrl = process.env.NEXT_PUBLIC_CDN_URL_LOCAL as string;
		const storageFilePath = params.storageUrl.split('.appspot.com/')?.[1] || '';
		const bucketNameUriEncoded = encodeURIComponent(params.bucketName);
		const storageFilePathUriEncoded = encodeURIComponent(storageFilePath);
		const file = `${cdnUrl}/${bucketNameUriEncoded}/${storageFilePathUriEncoded}`;
		const response = await ky(file);
		if (response.status !== 200) {
			return Promise.reject(response.statusText);
		}
		const content = await response.text();
		return content;
	} catch (err) {
		console.log(err);
		return Promise.reject(err);
	}
};
