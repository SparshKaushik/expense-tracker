import * as d3 from "d3";
import { View } from "react-native";
import { Circle, G, Svg, Text } from "react-native-svg";

export default function BubbleChart(props: {
  height: number;
  width: number;
  data: Array<{ name: string; value: number; color: string }>;
  textProps?: any;
  circleProps?: any;
}) {
  const { height, width, data, textProps, circleProps } = props;

  //   @ts-ignore
  let pack = (data) =>
    d3
      .pack()
      .size([width - 2, height - 2])
      //   @ts-ignore
      .padding(3)(d3.hierarchy({ children: data }).sum((d) => d.value));

  const root = pack(data);

  //   @ts-ignore
  let fontSizeGenerator = (value) => {
    let size = 0;
    if (value < 10) {
      size = 8;
    } else if (value >= 10 && value < 50) {
      size = 12;
    } else {
      size = 16;
    }
    return size;
  };

  let leaves = [];
  for (let leaf of root.leaves() as any) {
    leaves.push(
      <G transform={`translate(${leaf.x + 1},${leaf.y + 1})`}>
        <Circle {...circleProps} r={leaf.r} fill={leaf.data.color} />
        <Text
          {...textProps}
          fill="#FFFFFF"
          fontSize={fontSizeGenerator(leaf.data.value)}
          x="0"
          y={leaf.data.value * 0.1}
          textAnchor="middle"
        >
          {leaf.data.name}
        </Text>
      </G>
    );
  }

  return (
    <View className="flex-1">
      <Svg width={width || 400} height={height || 300}>
        {leaves}
      </Svg>
    </View>
  );
}
