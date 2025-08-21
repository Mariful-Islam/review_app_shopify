import { TitleBar } from "@shopify/app-bridge-react";
import {
  Badge,
  Button,
  Card,
  Collapsible,
  Link,
  Page,
  Text,
} from "@shopify/polaris";
import React, { useState } from "react";
import { IoCheckmarkCircleOutline, IoCheckmarkCircle } from "react-icons/io5";

const options = [
  {
    title: "Add Star Review Block",
    desciption: "",
    isCompeleted: true,
  },
  {
    title: "Add Review Section",
    desciption: "",
    isCompeleted: true,
  },
];

function Index() {
  const [isCollaps, setIsCollaps] = useState(null);

  const handleCollaps = () => {
    setIsCollaps(!isCollaps);
  };

  return (
    <Page>
      <TitleBar title="Setup Your Review"></TitleBar>
      <Card>
        <Text variant="headingMd" as="h2">
          Add Widget <Badge tone="attention">1/3 is completed !</Badge>
        </Text>
        <div
          onClick={handleCollaps}
          style={{ marginTop: 6, cursor: "pointer" }}
        >
          Add block and reviews section in your store
        </div>

        <div style={{ marginTop: 30 }}>
          {options.map((item, i) => (
            <React.Fragment key={i}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  cursor: "pointer",
                  marginTop: 18,
                }}
                onClick={() => {
                  setIsCollaps(i);
                }}
              >
                {item.isCompeleted ? (
                  <IoCheckmarkCircle style={{ width: 15, height: 15 }} />

                ) : (
                  <IoCheckmarkCircleOutline style={{ width: 15, height: 15 }} />

                )}

                <Text variant="headingSm" as="h3">
                  {item.title}
                </Text>
              </div>

              <Collapsible
                open={isCollaps === i}
                id="basic-collapsible"
                transition={{
                  duration: "200ms",
                  timingFunction: "ease-in-out",
                }}
                expandOnPrint
              >
                <div style={{ marginLeft: 20, marginTop: 8 }}>
                  <p>
                    Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                    Totam illum ipsum aspernatur, dicta numquam distinctio
                    consequuntur labore voluptates error quis soluta, quam hic.
                    Quia officia culpa autem dolore id saepe!
                  </p>
                  <div style={{ marginTop: 12 }}>
                    <Button variant="primary">Add</Button>
                  </div>
                </div>
              </Collapsible>
            </React.Fragment>
          ))}
        </div>
      </Card>
    </Page>
  );
}

export default Index;
