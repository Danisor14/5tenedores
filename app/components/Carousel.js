import React from "react";
import { Image } from "react-native-elements";
import Carousel from "react-native-snap-carousel";

export default function CarouselImage(props) {
  const { arrayImages, height, width } = props;
  console.log(props);

  const renderItem = ({ item }) => {
    //destructurin en los parentesis
    return <Image style={{ width, height }} source={{ uri: item }} />;
  };

  return (
    <Carousel
      layout={"default"}
      data={arrayImages}
      //data={arrayImages}
      sliderWidth={width}
      itemWidth={width}
      renderItem={renderItem}
    />
  );
}
