import React, { useState } from 'react';
import { View, Modal, TouchableOpacity, Dimensions } from 'react-native';
import Carousel, { ICarouselInstance, Pagination } from 'react-native-reanimated-carousel';
import { Image as ImageType } from "../../Types";
import { Image } from 'expo-image';
import { useSharedValue } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

type ImageCarouselProps = {
    images: ImageType[];
    autoPlay?: boolean;
    loop?: boolean;
    className?: string;
    indexRef: number;
    setIndexRef: Function;
};

const defaultDataWith6Colors = [
    "#B0604D",
    "#899F9C",
    "#B3C680",
    "#5C6265",
    "#F1F1F1",
];

const CarouselStage = ({ images, autoPlay = false, loop = false, className, indexRef, setIndexRef }: ImageCarouselProps) => {
    const [viewWidth, setViewWidth] = useState(0);
    const [modalVisible, setModalVisible] = useState(false);
    const progress = useSharedValue<number>(0);
    const ref = React.useRef<ICarouselInstance>(null);

    const handleLayout = (event: any) => {
        const { width } = event.nativeEvent.layout;
        setViewWidth(width);
    };

    const onPressPagination = (index: number) => {
        setIndexRef(index);
        ref.current?.scrollTo({
            index,
            animated: true,
        });
    };

    const openImage = () => {
        setModalVisible(true);
    };

    const closeImage = () => {
        setModalVisible(false);
    };

    const renderItem = ({ item }: { item: ImageType }) => (
        <TouchableOpacity
            activeOpacity={0.8}
            onPress={openImage}
            style={{ width: viewWidth, height: (viewWidth * 9) / 16 }}
            className="flex-row justify-center items-center"
        >
            <Image
                source={{ uri: item.path }}
                style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: 8,
                }}
                contentFit="cover"
            />
        </TouchableOpacity>
    );

    return (
        <>
            <View
                onLayout={handleLayout}
                className={`flex-1 ${className} w-full border border-tertiary dark:border-tertiary-dark rounded-[10px]`}
            >
                {viewWidth > 0 && (
                    <Carousel
                        ref={ref}
                        width={viewWidth}
                        height={(viewWidth * 9) / 16}
                        data={images}
                        renderItem={renderItem}
                        autoPlay={autoPlay}
                        autoPlayInterval={3000}
                        loop={loop}
                        onSnapToItem={(e) => setIndexRef(e)}
                        onProgressChange={progress}
                    />
                )}
            </View>

            <Pagination.Basic<{ color: string }>
                progress={progress}
                data={defaultDataWith6Colors.slice(0, images.length).map((color) => ({ color }))}
                dotStyle={{
                    width: 25,
                    height: 4,
                    backgroundColor: "#262626",
                    marginVertical: 10,
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

            <Modal visible={modalVisible} transparent animationType="fade">
                <View className="flex-1 bg-black justify-center items-center">
                    <TouchableOpacity onPress={closeImage} className="absolute top-14 right-6 z-10">
                        <Ionicons name="close" size={36} color="#fff" />
                    </TouchableOpacity>
                    <Image
                        source={{ uri: images[indexRef]?.path }}
                        style={{
                            width: Dimensions.get('window').width,
                            height: Dimensions.get('window').height,
                        }}
                        contentFit="contain"
                    />
                </View>
            </Modal>
        </>
    );
};

export default CarouselStage;
