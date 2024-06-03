import { Image } from "~/components/image";
import { urls } from "~/urls";

export const BackgroundVideo: React.FC = () => (
	<video
		autoPlay
		disablePictureInPicture
		disableRemotePlayback
		loop
		muted
		playsInline
		className="absolute left-0 top-0 size-full object-cover brightness-50"
		poster="https://img.flirtu.al/6be390d0-4479-4a98-8c7a-10257ea5585a"
	>
		<source
			src="https://img.flirtu.al/video.webm"
			type="video/webm; codecs=vp9"
		/>
		<source src="https://img.flirtu.al/video.mp4" type="video/mp4" />
		<Image
			fill
			alt="Flirtual dates"
			src={urls.media("6be390d0-4479-4a98-8c7a-10257ea5585a")}
		/>
	</video>
);
