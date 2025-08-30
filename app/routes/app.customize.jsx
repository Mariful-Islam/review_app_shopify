import { TitleBar } from "@shopify/app-bridge-react";
import {
  Bleed,
  BlockStack,
  Box,
  Card,
  Divider,
  InlineGrid,
  Page,
  SkeletonBodyText,
  SkeletonDisplayText,
  Text,
} from "@shopify/polaris";
import React, { useState } from "react";
import ReactStars from "react-stars";

const colors = [
  {
    name: "Red",
    color: "#FF0000",
  },
  {
    name: "Green",
    color: "#00df64ff",
  },
  {
    name: "Blue",
    color: "#5044ffff",
  },
  {
    name: "Yellow",
    color: "#efff0bff",
  },
  {
    name: "Orange",
    color: "#ff8800ff",
  },
  {
    name: "Red",
    color: "#000000ff",
  },
];

function ColorSchema() {
  const [selectedColor, setSelectedColor] = useState(null);

  const SkeletonLabel = (props) => {
    return (
      <Box
        background="bg-fill-tertiary"
        minHeight="1rem"
        maxWidth="5rem"
        borderRadius="base"
        {...props}
      />
    );
  };

  console.log(selectedColor, "ppppppppppp")

  return (
    <Page
      //   backAction={{ content: "Color Schema", url: "/products" }}
      title="Color Schema"
      secondaryActions={
        [
          // {
          //   content: "Duplicate",
          //   icon: DuplicateIcon,
          //   accessibilityLabel: "Secondary action label",
          //   onAction: () => alert("Duplicate action"),
          // },
          // {
          //   content: "Archive",
          //   icon: ArchiveIcon,
          //   accessibilityLabel: "Secondary action label",
          //   onAction: () => alert("Archive action"),
          // },
          // {
          //   content: "Delete",
          //   icon: DeleteIcon,
          //   destructive: true,
          //   accessibilityLabel: "Secondary action label",
          //   onAction: () => alert("Delete action"),
          // },
        ]
      }
      //   pagination={{
      //     hasPrevious: true,
      //     hasNext: true,
      //   }}
    >
      <TitleBar title="Color Schema"></TitleBar>
      <InlineGrid columns={{ xs: 1, md: "2fr 1fr" }} gap="400">
        <BlockStack gap="400">
          <Card roundedAbove="sm">
            <Text variant="headingMd" as="h2">
              Theme Color
            </Text>
            <Text>Personalize store review color with your branding color</Text>

            <div style={{ height: 40 }}></div>

            <Text>Choose color</Text>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: 8,
                marginTop: 12,
              }}
            >
              {colors.map((color, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 6,
                    border: "solid",
                    borderWidth: 2,
                    borderColor: "#EBEBEB",
                    borderRadius: 12,
                    cursor: 'pointer',
                    ...(selectedColor === color.color && { borderColor: "#000000" }),
                  }}
                  onClick={() => setSelectedColor(color.color)}
                >
                  <div
                    style={{
                      backgroundColor: color.color,
                      height: 60,
                      width: "100%",
                      borderTopRightRadius: 12,
                      borderTopLeftRadius: 12,
                    }}
                  ></div>
                  <div
                    style={{ ...(selectedColor === color.color && { fontWeight: 700 }) }}
                  >
                    {color.name}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </BlockStack>
        <BlockStack gap={{ xs: "400", md: "200" }}>
          <Card roundedAbove="sm">
            <div
              style={{
                border: "solid",
                borderWidth: 1,
                borderColor: "#EBEBEB",
                borderRadius: 12,
                padding:8
              }}
            >
              <div>
                <div style={{display: 'flex', gap: 4, alignItems: 'center'}}>
                  {selectedColor && <ReactStars value={4} co color1={`${selectedColor}`} color2={`${selectedColor}`} />}
                  

                  <span style={{color: selectedColor}}>(4.7)</span>
                  <span style={{marginLeft: 12, color: selectedColor}}>300 people love this</span>
                </div>
              </div>
            </div>
          </Card>
        </BlockStack>
      </InlineGrid>
    </Page>
  );
}
export default ColorSchema;
