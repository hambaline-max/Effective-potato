import { Composition, Folder } from "remotion";
import { HelloWorld } from "./HelloWorld";
import { Logo } from "./HelloWorld/Logo";
import { Title } from "./HelloWorld/Title";
import { MotionStudio } from "./Motionstudio";
import { ShortsStudio } from "./ShortsStudio";
export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Folder name="Elements">
        <Composition
          id="Logo"
          component={Logo}
          durationInFrames={150}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{
            logoColor1: "#91EAE4",
            logoColor2: "#86A8E7",
          }}
        />
        <Composition
          id="Title"
          component={Title}
          durationInFrames={115}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{
            titleText: "Welcome to Remotion",
            titleColor: "#000000",
          }}
        />
      </Folder>
      <Composition
        // You can take the "id" to render a video:
        // bunx remotion render HelloWorld
        id="HelloWorld"
        component={HelloWorld}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        // You can override these props for each render:
        // https://www.remotion.dev/docs/parametrized-rendering
        defaultProps={{
          titleText: "Welcome to Remotion",
          titleColor: "#000000",
        }}
      />

<Composition
  id="ClayAnimation"
  component={MotionStudio}
  durationInFrames={900}
  fps={30}
  width={1080}
  height={1920}
  defaultProps={{
    title: "DUNIA CLAY",
    subtitle: "Cerita animasi menarik",
    style: "clay",
  }}
/>

<Composition
  id="3DExplainer"
  component={MotionStudio}
  durationInFrames={900}
  fps={30}
  width={1080}
  height={1920}
  defaultProps={{
    title: "FAKTA MENARIK",
    subtitle: "Temukan hal baru hari ini",
    style: "3d",
  }}
/>

<Composition
  id="Documentary"
  component={MotionStudio}
  durationInFrames={900}
  fps={30}
  width={1080}
  height={1920}
  defaultProps={{
    title: "KISAH DUNIA",
    subtitle: "Sebuah cerita dokumenter",
    style: "documentary",
  }}
/>

<Composition
  id="Infographic"
  component={MotionStudio}
  durationInFrames={900}
  fps={30}
  width={1080}
  height={1920}
  defaultProps={{
    title: "DATA MENARIK",
    subtitle: "Informasi dalam visual",
    style: "infographic",
  }}
/>

<Composition
  id="PixelArt"
  component={MotionStudio}
  durationInFrames={900}
  fps={30}
  width={1080}
  height={1920}
  defaultProps={{
    title: "PIXEL WORLD",
    subtitle: "Petualangan dimulai",
    style: "pixel",
  }}
/>

<Composition
  id="KineticTypography"
  component={MotionStudio}
  durationInFrames={900}
  fps={30}
  width={1080}
  height={1920}
  defaultProps={{
    title: "CERITA KITA",
    subtitle: "Kekuatan kata dan gerakan",
    style: "kinetic",
  }}
/>

<Composition
  id="MotionStudio"
  component={MotionStudio}
  durationInFrames={900}
  fps={30}
  width={1080}
  height={1920}
  defaultProps={{
    title: "CERITA KITA",
    subtitle: "Kekuatan kata dan gerakan",
    style: "kinetic",
  }}
/>

<Composition
  id="ShortsStudio"
  component={ShortsStudio}
  durationInFrames={900}
  fps={30}
  width={1080}
  height={1920}
  defaultProps={{
    title: "KENAPA KUCING SUKA MINUM AIR TOILET?",
    subtitle: "Ada alasan unik di balik kebiasaan ini!",
  }}
/>

    </>
  );
};
