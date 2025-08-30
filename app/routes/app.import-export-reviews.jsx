import {
  Button,
  Card,
  Divider,
  IndexTable,
  Link,
  Page,
  Text,
  useBreakpoints,
  useIndexResourceState,
} from "@shopify/polaris";

function ImportExportReviews() {


  return (
    <Page>
      <Card sectioned>
        <div style={{ display: "flex", justifyContent: "end" }}>
          <Button>Import Reviews</Button>
        </div>
      </Card>

      <div style={{ height: 20 }}></div>

    </Page>
  );
}

export default ImportExportReviews;
