import { TitleBar } from "@shopify/app-bridge-react";
import {
  Badge,
  Button,
  Card,
  Collapsible,
  Frame,
  Image,
  Link,
  Modal,
  Page,
  Text,
} from "@shopify/polaris";
import React, { useState } from "react";
import { IoCheckmarkCircleOutline, IoCheckmarkCircle } from "react-icons/io5";
import prodImg from "../../assets/images (1).jpeg";

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

const dummyReviews = [
  {
    customerName: "Emily Johnson",
    rating: 5,
    title: "Super comfortable!",
    comment:
      "These shoes are incredibly comfortable and stylish. I wear them every day!",
    createdAt: "2025-08-15T10:24:00Z",
  },
  {
    customerName: "Daniel Smith",
    rating: 4,
    title: "Great for walking",
    comment:
      "Good support and cushion. Perfect for long walks. A bit tight at first.",
    createdAt: "2025-08-10T14:50:00Z",
  },
  {
    customerName: "Sophia Lee",
    rating: 5,
    title: "Exactly what I wanted",
    comment:
      "Color is true to the picture, and fits perfectly. Very happy with the purchase.",
    createdAt: "2025-08-18T09:12:00Z",
  },
  {
    customerName: "Michael Brown",
    rating: 3,
    title: "Decent but not amazing",
    comment:
      "Looks good but not as durable as I hoped. Still okay for the price.",
    createdAt: "2025-08-05T18:35:00Z",
  },
  {
    customerName: "Olivia Davis",
    rating: 4,
    title: "Stylish and light",
    comment:
      "Super lightweight and trendy. Just wish the arch support was better.",
    createdAt: "2025-07-30T11:00:00Z",
  },
  {
    customerName: "James Wilson",
    rating: 2,
    title: "Not for wide feet",
    comment: "Shoes look good but run narrow. Uncomfortable for my foot shape.",
    createdAt: "2025-08-01T13:45:00Z",
  },
  {
    customerName: "Ava Martinez",
    rating: 5,
    title: "Best shoes I've owned",
    comment: "Seriously, these are perfect. Comfort, style, fit — all 10/10.",
    createdAt: "2025-08-20T08:18:00Z",
  },
  {
    customerName: "William Anderson",
    rating: 3,
    title: "Average quality",
    comment:
      "They're fine for casual wear but not great for running or long days.",
    createdAt: "2025-08-03T15:22:00Z",
  },
  {
    customerName: "Isabella Thomas",
    rating: 4,
    title: "Really cute!",
    comment:
      "They look great with jeans or dresses. Slight heel makes it classy.",
    createdAt: "2025-08-08T16:00:00Z",
  },
  {
    customerName: "Ethan Taylor",
    rating: 1,
    title: "Fell apart fast",
    comment:
      "After just 2 weeks of use, the sole is already separating. Disappointed.",
    createdAt: "2025-07-28T12:30:00Z",
  },
  {
    customerName: "Mia Hernandez",
    rating: 5,
    title: "Love them!",
    comment:
      "Perfect size and very comfortable. I’m going to buy another pair.",
    createdAt: "2025-08-12T10:00:00Z",
  },
  {
    customerName: "Alexander Moore",
    rating: 4,
    title: "Nice upgrade",
    comment:
      "Switched from my old sneakers to these — no regrets. Great quality.",
    createdAt: "2025-08-14T14:10:00Z",
  },
  {
    customerName: "Charlotte Martin",
    rating: 3,
    title: "Just okay",
    comment:
      "Look nice but not the most comfortable after a few hours of wear.",
    createdAt: "2025-08-06T11:45:00Z",
  },
  {
    customerName: "Benjamin Jackson",
    rating: 5,
    title: "Amazing shoes!",
    comment:
      "Highly recommend these. Great grip, comfy, and they look premium.",
    createdAt: "2025-08-19T17:00:00Z",
  },
  {
    customerName: "Amelia White",
    rating: 4,
    title: "Good buy",
    comment: "True to size, well made, and delivered fast. Satisfied overall.",
    createdAt: "2025-08-09T13:15:00Z",
  },
  {
    customerName: "Logan Harris",
    rating: 2,
    title: "Not worth the hype",
    comment:
      "Expected more based on the reviews. Not that comfortable for the price.",
    createdAt: "2025-07-31T09:50:00Z",
  },
];

const sampleProducts = [
  {
    id: 1,
    name: "Wireless Headphones",
    image: prodImg,
    price: 99.99,
  },
  {
    id: 2,
    name: "Smartphone",
    image: prodImg,
    price: 599.99,
  },
  {
    id: 3,
    name: "Laptop",
    image: prodImg,
    price: 1099.0,
  },
  {
    id: 4,
    name: "Bluetooth Speaker",
    image: prodImg,
    price: 49.99,
  },
  {
    id: 5,
    name: "Smart Watch",
    image: prodImg,
    price: 199.5,
  },
];

function Index() {
  const [isCollaps, setIsCollaps] = useState(null);
  const [isGenerateLoading, setIsGenerateLoading] = useState(false);
  const [products, setProducts] = useState(false);
  const [isOpenProductList, setIsOpenProductList] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleCollaps = () => {
    setIsCollaps(!isCollaps);
  };

  const fetchProduct = async () => {
    // const res = await fetch(`${process.env.API_URL}/api/reviews?storeId=71993557149`)
    const res = await fetch(`/storefront/api/2023-10/products.json`);

    const data = await res.data;
    setProducts(data);
  };

  const onCloseDummyReviewGeneratorModal = () => {
    setIsOpenProductList(false);
    setSelectedProduct(null);
    setIsGenerateLoading(false)
  };

  const handleGenerateDummyData = async () => {
    setIsGenerateLoading(true);

    dummyReviews.map(async (review) => {
      const res = await fetch(
        `https://shopify-review-api.vercel.app/api/reviews?productId=47063013195933`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-secret": "832a239e-6909-4b10-bcf5-a69f44edaa89",
          },
          body: JSON.stringify({
            "productId": "47063013195933",
            "productName": selectedProduct?.name,
            "customerName": review.customerName,
            "rating": review.rating,
            "title": review.title,
            "comment": review.comment,
            "shopId": "71993557149",
            "shopName": "saad_1731"
          }),
        },
      );

      const data = await res.json();
      setIsOpenProductList(false)
      setIsGenerateLoading(false)

      return null;
    });


    setTimeout(() => setIsGenerateLoading(false), 1000);
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

      <div style={{ height: 20 }}></div>

      <Card>
        <Text variant="headingMd" as="h2">
          Generate Dummy Data
        </Text>
        <div style={{ marginTop: 14 }}></div>

        <Button
          variant="primary"
          loading={isGenerateLoading}
          onClick={() => {
            setIsGenerateLoading(true);
            setTimeout(() => setIsGenerateLoading(false), 500);
            setIsOpenProductList(true);
          }}
        >
          Select Product
        </Button>
      </Card>

      <Frame>
        <Modal
          size="small"
          open={isOpenProductList}
          onClose={onCloseDummyReviewGeneratorModal}
          title="Select a product "
          primaryAction={{
            content: "Generate",
            onAction: handleGenerateDummyData,
            loading: isGenerateLoading,
            disabled: selectedProduct ? false : true,
          }}
          secondaryActions={[
            {
              content: "Cancel",
              onAction: onCloseDummyReviewGeneratorModal,
            },
          ]}
        >
          <Modal.Section>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {sampleProducts.map((prod, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    border: "solid",
                    borderWidth: "1px",
                    borderColor: "#EBEBEB",
                    borderRadius: 7,
                    paddingLeft: 12,
                    paddingRight: 12,
                    cursor: "pointer",
                    ...(selectedProduct?.id === prod?.id && {
                      backgroundColor: "#EBEBEB",
                    }),
                  }}
                  onClick={() => setSelectedProduct(prod)}
                >
                  <Image
                    source={
                      "https://saad-1731.myshopify.com/cdn/shop/files/images_4.jpg?v=1752395349"
                    }
                    alt="abc"
                    width={100}
                    height={100}
                  />
                  <div>
                    <strong>{prod.name}</strong>
                    <div>{prod.price}</div>
                  </div>
                </div>
              ))}
            </div>
          </Modal.Section>
        </Modal>
      </Frame>
    </Page>
  );
}

export default Index;
