import React, { MutableRefObject, Ref, useState } from 'react';
import { Dimensions } from 'react-native';
import { View } from 'react-native';
import Carousel, { ICarouselInstance, Pagination } from 'react-native-reanimated-carousel';
import { Image as ImageType } from "../../Types"
import { Image } from 'expo-image';
import { useSharedValue } from 'react-native-reanimated';

type ImageCarouselProps = {
    images: ImageType[];
    autoPlay?: boolean;
    loop?: boolean;
    className?: string;
    indexRef: MutableRefObject<number>;
};

const defaultDataWith6Colors = [
	"#B0604D",
	"#899F9C",
	"#B3C680",
	"#5C6265",
	"#F1F1F1",
];
 

const CarouselStage = ({ images, autoPlay = false, loop = false, className, indexRef }: ImageCarouselProps) => {
    const [viewWidth, setViewWidth] = useState(0);
	const progress = useSharedValue<number>(0);
    // const [activeIndex, setActiveIndex] = useState(0);

    const handleLayout = (event: any) => {
        const { width } = event.nativeEvent.layout;
        setViewWidth(width);
    };

    const baseOptions = {
        vertical: false,
        width: viewWidth || 200,
        height: viewWidth ? viewWidth * 0.644 : 160, 
         
    };

    const ref = React.useRef<ICarouselInstance>(null);

    const onPressPagination = (index: number) => {
        indexRef.current = index;
        ref.current?.scrollTo({
            index, 
            animated: true,
        });
    };

    

    const renderItem = ({ item }: { item: ImageType }) => (
        <View className="min-w-full h-56 max-h-56 flex-row justify-center items-center ">
            <Image
                source={{ uri: item.path }}
                className="w-full h-full rounded-lg"
                style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: 8,
                }}
                contentFit="cover"
            />
        </View>
    );

    return (
        <>
            <View className={`flex-1  ${className} w-full border border-tertiary dark:border-tertiary-dark rounded-[10px]`} onLayout={handleLayout}>
                <Carousel
                
                    {...baseOptions}
                    data={images}
                    renderItem={renderItem}
                    autoPlay={autoPlay}
                    autoPlayInterval={3000}
                    loop={loop}
                    onSnapToItem={(e) => indexRef.current = e}
                    onProgressChange={progress}

                />
            </View>
            <Pagination.Basic<{ color: string } >
                progress={progress}
                data={defaultDataWith6Colors.slice(0, images.length).map((color) => ({ color }))}
                dotStyle={{
                    width: 25,
                    height: 4,
                    backgroundColor: "#262626",
                    marginVertical:10
                }}
                
                activeDotStyle={{
                    overflow: "hidden",
                    backgroundColor: "#f1f1f1",
                }}
                containerStyle={{
                    gap: 10,
                    marginBottom: 10,
                }}
                horizontal
                onPress={onPressPagination}
                
            />
        </>
    );
};

export default CarouselStage;