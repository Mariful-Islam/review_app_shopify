import { TitleBar } from "@shopify/app-bridge-react";
import {
  ActionList,
  Badge,
  Button,
  Card,
  ChoiceList,
  DataTable,
  DropZone,
  Frame,
  Icon,
  IndexFilters,
  IndexTable,
  LegacyStack,
  Link,
  Modal,
  Page,
  Pagination,
  Popover,
  RangeSlider,
  Text,
  TextField,
  Thumbnail,
  useBreakpoints,
  useIndexResourceState,
  useSetIndexFiltersMode,
} from "@shopify/polaris";
import React, { useCallback, useEffect, useState } from "react";
import {
  DeleteIcon,
  MenuHorizontalIcon,
  RefreshIcon,
  NoteIcon,
} from "@shopify/polaris-icons";
import Papa from "papaparse";
import ReactStars from "react-stars";
import moment from "moment/moment";
import * as XLSX from "xlsx";

export default function ManageReviews() {
  const [reviews, setReviews] = useState({});
  const [indexReviews, setIndexReviews] = useState([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(false);

  const [page, setPage] = useState(1);
  const [limit] = useState(8);

  const [selectedReview, setSelectedReview] = useState(null);
  const [deleteConsent, setDeleteConsent] = useState(null);
  const [isDownloadCSV, setIsDownloadCSV] = useState(false);
  const [isImportCSV, setIsImportCSV] = useState(false);

  const [accountStatus, setAccountStatus] = useState(undefined);
  const [moneySpent, setMoneySpent] = useState(undefined);
  const [taggedWith, setTaggedWith] = useState("");
  const [queryValue, setQueryValue] = useState("");

  const getReviews = async () => {
    setIsLoadingReviews(true);

    try {
      const res = await fetch(
        `https://shopify-review-api.vercel.app/api/reviews?shopId=71993557149&page=${page}&limit=${limit}&search=${queryValue}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "x-api-secret": "832a239e-6909-4b10-bcf5-a69f44edaa89",
          },
        },
      );

      const data = await res.json();

      const indexData = data?.reviews?.map(({ _id, ...rest }, index) => ({
        id: _id,
        ...rest,
      }));

      setIndexReviews(indexData);

      setReviews(data);
      setIsLoadingReviews(false);

      // here data are used
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getReviews();
  }, [page, queryValue]);

  const [popoverActive, setPopoverActive] = useState(null);

  const togglePopoverActive = (index) => {
    setPopoverActive(index);
  };

  const rows = reviews?.reviews?.map((review, i) => [
    <div
      style={{
        cursor: "pointer",
        textDecorationLine: "underline",
        textDecorationStyle: "dotted",
      }}
      key={i}
      plain
      onClick={() => {
        setSelectedReview(review);
      }}
    >
      {review.customerName}
    </div>,
    review.rating,
    review.title,
    new Date(review.createdAt).toLocaleDateString(),

    <div key={i} style={{ cursor: "pointer", position: "relative" }}>
      <div style={{ height: "250px", position: "absolute" }}>
        <Popover
          active={popoverActive === i}
          activator={
            <div onClick={() => togglePopoverActive(i)}>
              <Icon source={MenuHorizontalIcon} tone="base" />
            </div>
          }
          autofocusTarget="first-node"
          onClose={() => togglePopoverActive(null)}
        >
          <ActionList
            actionRole="menuitem"
            items={[
              {
                content: "Delete",
                icon: DeleteIcon,
                destructive: true,
                onAction: () => setDeleteConsent(review),
              },
            ]}
          />
        </Popover>
      </div>
    </div>,
  ]);

  const onClose = () => {
    setDeleteConsent(null);
  };

  const handleDeleteReview = async () => {
    try {
      const res = await fetch(
        `https://shopify-review-api.vercel.app/api/reviews?reviewId=${deleteConsent.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "x-api-secret": "832a239e-6909-4b10-bcf5-a69f44edaa89",
          },
        },
      );

      const data = await res.json();

      onClose();
      getReviews();

      // here data are used
    } catch (err) {
      console.log(err);
    }
  };

  const handleExport = async () => {
    try {
      // 1. Fetch data from your API
      const response = await fetch(
        `https://shopify-review-api.vercel.app/api/reviews?shopId=71993557149&all=true`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "x-api-secret": "832a239e-6909-4b10-bcf5-a69f44edaa89",
          },
        },
      );

      const data = await response.json();

      // 2. Convert JSON to CSV
      const csv = Papa.unparse(data?.reviews);

      // 3. Trigger file download
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", "data.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error exporting data:", error);
    }
  };

  // index table
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const [itemStrings, setItemStrings] = useState([
    "All",
    "Unpaid",
    "Open",
    "Closed",
    "Local delivery",
    "Local pickup",
  ]);
  const deleteView = (index) => {
    const newItemStrings = [...itemStrings];
    newItemStrings.splice(index, 1);
    setItemStrings(newItemStrings);
    setSelected(0);
  };

  const duplicateView = async (name) => {
    setItemStrings([...itemStrings, name]);
    setSelected(itemStrings.length);
    await sleep(1);
    return true;
  };

  const tabs = itemStrings.map((item, index) => ({
    content: item,
    index,
    onAction: () => {},
    id: `${item}-${index}`,
    isLocked: index === 0,
    actions:
      index === 0
        ? []
        : [
            {
              type: "rename",
              onAction: () => {},
              onPrimaryAction: async (value) => {
                const newItemsStrings = tabs.map((item, idx) => {
                  if (idx === index) {
                    return value;
                  }
                  return item.content;
                });
                await sleep(1);
                setItemStrings(newItemsStrings);
                return true;
              },
            },
            {
              type: "duplicate",
              onPrimaryAction: async (value) => {
                await sleep(1);
                duplicateView(value);
                return true;
              },
            },
            {
              type: "edit",
            },
            {
              type: "delete",
              onPrimaryAction: async () => {
                await sleep(1);
                deleteView(index);
                return true;
              },
            },
          ],
  }));
  const [selected, setSelected] = useState(0);

  const onCreateNewView = async (value) => {
    await sleep(500);
    setItemStrings([...itemStrings, value]);
    setSelected(itemStrings.length);
    return true;
  };
  const sortOptions = [
    { label: "Order", value: "order asc", directionLabel: "Ascending" },
    { label: "Order", value: "order desc", directionLabel: "Descending" },
    { label: "Customer", value: "customer asc", directionLabel: "A-Z" },
    { label: "Customer", value: "customer desc", directionLabel: "Z-A" },
    { label: "Date", value: "date asc", directionLabel: "A-Z" },
    { label: "Date", value: "date desc", directionLabel: "Z-A" },
    { label: "Total", value: "total asc", directionLabel: "Ascending" },
    { label: "Total", value: "total desc", directionLabel: "Descending" },
  ];
  const [sortSelected, setSortSelected] = useState(["order asc"]);
  const { mode, setMode } = useSetIndexFiltersMode();
  const onHandleCancel = () => {};

  const onHandleSave = async () => {
    await sleep(1);
    return true;
  };

  const primaryAction =
    selected === 0
      ? {
          type: "save-as",
          onAction: onCreateNewView,
          disabled: false,
          loading: false,
        }
      : {
          type: "save",
          onAction: onHandleSave,
          disabled: false,
          loading: false,
        };

  const handleAccountStatusChange = useCallback(
    (value) => setAccountStatus(value),
    [],
  );
  const handleMoneySpentChange = useCallback(
    (value) => setMoneySpent(value),
    [],
  );
  const handleTaggedWithChange = useCallback(
    (value) => setTaggedWith(value),
    [],
  );
  const handleFiltersQueryChange = useCallback(
    (value) => setQueryValue(value),
    [],
  );
  const handleAccountStatusRemove = useCallback(
    () => setAccountStatus(undefined),
    [],
  );
  const handleMoneySpentRemove = useCallback(
    () => setMoneySpent(undefined),
    [],
  );
  const handleTaggedWithRemove = useCallback(() => setTaggedWith(""), []);
  const handleQueryValueRemove = useCallback(() => setQueryValue(""), []);
  const handleFiltersClearAll = useCallback(() => {
    handleAccountStatusRemove();
    handleMoneySpentRemove();
    handleTaggedWithRemove();
    handleQueryValueRemove();
  }, [
    handleAccountStatusRemove,
    handleMoneySpentRemove,
    handleQueryValueRemove,
    handleTaggedWithRemove,
  ]);

  const filters = [
    {
      key: "accountStatus",
      label: "Account status",
      filter: (
        <ChoiceList
          title="Account status"
          titleHidden
          choices={[
            { label: "Enabled", value: "enabled" },
            { label: "Not invited", value: "not invited" },
            { label: "Invited", value: "invited" },
            { label: "Declined", value: "declined" },
          ]}
          selected={accountStatus || []}
          onChange={handleAccountStatusChange}
          allowMultiple
        />
      ),
      shortcut: true,
    },
    {
      key: "taggedWith",
      label: "Tagged with",
      filter: (
        <TextField
          label="Tagged with"
          value={taggedWith}
          onChange={handleTaggedWithChange}
          autoComplete="off"
          labelHidden
        />
      ),
      shortcut: true,
    },
    {
      key: "moneySpent",
      label: "Money spent",
      filter: (
        <RangeSlider
          label="Money spent is between"
          labelHidden
          value={moneySpent || [0, 500]}
          prefix="$"
          output
          min={0}
          max={2000}
          step={1}
          onChange={handleMoneySpentChange}
        />
      ),
    },
  ];

  const appliedFilters = [];
  if (accountStatus && !isEmpty(accountStatus)) {
    const key = "accountStatus";
    appliedFilters.push({
      key,
      label: disambiguateLabel(key, accountStatus),
      onRemove: handleAccountStatusRemove,
    });
  }
  if (moneySpent) {
    const key = "moneySpent";
    appliedFilters.push({
      key,
      label: disambiguateLabel(key, moneySpent),
      onRemove: handleMoneySpentRemove,
    });
  }
  if (!isEmpty(taggedWith)) {
    const key = "taggedWith";
    appliedFilters.push({
      key,
      label: disambiguateLabel(key, taggedWith),
      onRemove: handleTaggedWithRemove,
    });
  }

  const resourceName = {
    singular: "review",
    plural: "reviews",
  };

  const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(indexReviews);

  let rowMarkup = [];

  if (indexReviews) {
    rowMarkup = indexReviews?.map(
      (
        {
          id,
          productName,
          customerName,
          productId,
          shopName,
          rating,
          title,
          shopId,
          createdAt,
          comment,
        },
        index,
      ) => (
        <IndexTable.Row
          id={id}
          key={id}
          selected={selectedResources.includes(id)}
          position={index}
        >
          <IndexTable.Cell>
            <Link
              dataPrimaryLink
              url="#"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();

                setSelectedReview({
                  id: id,
                  customerName: customerName,
                  productId: productId,
                  shopName: shopName,
                  rating: rating,
                  title: title,
                  shopId: shopId,
                  comment: comment,
                  createdAt: createdAt,
                });
              }}
            >
              <Text variant="bodyMd" fontWeight="bold" as="span">
                {productName}
              </Text>
            </Link>
          </IndexTable.Cell>
          <IndexTable.Cell>
            {
              <ReactStars
                count={rating}
                size={17}
                color1={"#ffd700"}
                color2={"#ffd700"}
              />
            }
          </IndexTable.Cell>
          <IndexTable.Cell>{customerName}</IndexTable.Cell>
          <IndexTable.Cell>
            {/* <Text as="span" alignment="end" numeric> */}
            {title}
            {/* </Text> */}
          </IndexTable.Cell>
          <IndexTable.Cell>
            {moment(createdAt).format("DD MMM, YYYY")}
          </IndexTable.Cell>

          <IndexTable.Cell>
            <div
              key={index}
              style={{ cursor: "pointer", position: "relative" }}
            >
              <div style={{ height: "250px", position: "absolute" }}>
                <Popover
                  active={popoverActive === index}
                  activator={
                    <div
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        togglePopoverActive(index);
                      }}
                      style={{ marginTop: -8 }}
                    >
                      <Icon source={MenuHorizontalIcon} tone="base" />
                    </div>
                  }
                  autofocusTarget="first-node"
                  onClose={() => togglePopoverActive(null)}
                >
                  <ActionList
                    actionRole="menuitem"
                    items={[
                      {
                        content: "Delete",
                        icon: DeleteIcon,
                        destructive: true,
                        onAction: (e) => {
                          console.log(e);

                          setDeleteConsent({
                            id: id,
                            customerName: customerName,
                            productId: productId,
                            shopName: shopName,
                            rating: rating,
                            title: title,
                            shopId: shopId,
                            createdAt: createdAt,
                          });
                        },
                      },
                    ]}
                  />
                </Popover>
              </div>
            </div>
          </IndexTable.Cell>
        </IndexTable.Row>
      ),
    );
  }

  console.log(selectedReview, "----------");

  const [files, setFiles] = useState([]);
  const [parsedData, setParsedData] = useState([]);

  const validTypes = [
    "text/csv",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-excel",
  ];

  const handleDropZoneDrop = useCallback(
    async (_dropFiles, acceptedFiles, _rejectedFiles) => {
      const filteredFiles = acceptedFiles.filter((file) =>
        validTypes.includes(file.type),
      );
      setFiles((prev) => [...prev, ...filteredFiles]);

      for (const file of filteredFiles) {
        if (file.type === "text/csv") {
          // Parse CSV
          const text = await file.text();
          const result = Papa.parse(text, { header: true });
          setParsedData((prev) => [...prev, ...result.data]);
        } else if (
          file.type ===
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
          file.type === "application/vnd.ms-excel"
        ) {
          // Parse XLSX
          const data = await file.arrayBuffer();
          const workbook = XLSX.read(data, { type: "array" });
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          const json = XLSX.utils.sheet_to_json(sheet);
          setParsedData((prev) => [...prev, ...json]);
        }
      }
    },
    [],
  );

  const validImageTypes = ["image/gif", "image/jpeg", "image/png"];

  const fileUpload = !files.length && <DropZone.FileUpload />;
  const uploadedFiles = files.length > 0 && (
    <div style={{ padding: "0" }}>
      <LegacyStack vertical>
        {files.map((file, index) => (
          <LegacyStack alignment="center" key={index}>
            <Thumbnail
              size="small"
              alt={file.name}
              source={
                validImageTypes.includes(file.type)
                  ? window.URL.createObjectURL(file)
                  : NoteIcon
              }
            />
            <div>
              {file.name}{" "}
              <Text variant="bodySm" as="p">
                {file.size} bytes
              </Text>
            </div>
          </LegacyStack>
        ))}
      </LegacyStack>
    </div>
  );

  useEffect(() => {
    if (parsedData.length > 0) {
      console.log(parsedData, "parsed data ----------");
      // Here you can send parsedData to your API or process it as needed
      parsedData.map((item) => {
        fetch(`https://shopify-review-api.vercel.app/api/reviews`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-secret": "832a239e-6909-4b10-bcf5-a69f44edaa89",
          },
          body: JSON.stringify(item),
        })
          .then((res) => res.json())
          .then((data) => {
            console.log(data, "uploaded data -----------");
            setFiles([]);
            setParsedData([]);
            setIsImportCSV(false);
            getReviews();
          })
          .catch((err) => {
            console.log(err);
          });

        return item;
      });
    }
  }, [parsedData]);

  return (
    <Page>
      <TitleBar title="Overview"></TitleBar>
      <Card>
        <Text variant="headingMd" as="h2">
          Review List
        </Text>

        <div style={{ display: "flex", justifyContent: "end" }}>
          <Button
            onClick={getReviews}
            loading={isLoadingReviews}
            disabled={isLoadingReviews}
          >
            <Icon source={RefreshIcon} tone="base" />
          </Button>
          &nbsp; &nbsp;
          <Button onClick={() => setIsDownloadCSV(true)}>Download</Button>{" "}
          &nbsp; &nbsp;
          <Button onClick={() => setIsImportCSV(true)} variant="primary">
            Import
          </Button>
        </div>
      </Card>

      <div style={{ height: 20 }}></div>
      <Card>
        <IndexFilters
          sortOptions={sortOptions}
          sortSelected={sortSelected}
          queryValue={queryValue}
          queryPlaceholder="Searching in all"
          onQueryChange={handleFiltersQueryChange}
          onQueryClear={() => setQueryValue("")}
          onSort={setSortSelected}
          primaryAction={primaryAction}
          cancelAction={{
            onAction: onHandleCancel,
            disabled: false,
            loading: false,
          }}
          tabs={tabs}
          selected={selected}
          onSelect={setSelected}
          canCreateNewView
          onCreateNewView={onCreateNewView}
          filters={filters}
          appliedFilters={appliedFilters}
          onClearAll={handleFiltersClearAll}
          mode={mode}
          setMode={setMode}
        />
        <IndexTable
          loading={isLoadingReviews}
          condensed={useBreakpoints().smDown}
          resourceName={resourceName}
          itemCount={indexReviews?.length}
          selectedItemsCount={
            allResourcesSelected ? "All" : selectedResources?.length
          }
          onSelectionChange={handleSelectionChange}
          headings={[
            { id: "product", title: "Product" },
            { id: "rating", title: "Rating" },
            { id: "customer", title: "Customer" },
            { id: "review", title: "Review" },
            { id: "created", title: "Created" },
            { id: "action", title: "Action" },
          ]}
        >
          {rowMarkup}
        </IndexTable>

        {reviews && (
          <div style={{ marginTop: 20, marginLeft: 10 }}>
            <div
              style={{
                maxWidth: "700px",
                margin: "auto",
              }}
            >
              <Pagination
                onPrevious={() => {
                  setPage(reviews.pagination.page - 1);
                }}
                onNext={() => {
                  setPage(reviews.pagination.page + 1);
                }}
                hasPrevious={reviews?.pagination?.page > 1}
                hasNext={
                  reviews?.pagination?.page < reviews?.pagination?.totalPages
                }
                label={`${(reviews?.pagination?.page - 1) * 8}-${(reviews?.pagination?.page - 1) * 8 + reviews?.reviews?.length} of ${reviews?.pagination?.total} reviews`}
              />
            </div>
          </div>
        )}
      </Card>

      <Frame>
        <Modal
          open={selectedReview ? true : false}
          onClose={() => setSelectedReview(null)}
          title={selectedReview ? selectedReview.title : "Customer Review"}
          primaryAction={{
            content: "Close",
            onAction: () => setSelectedReview(null),
          }}
        >
          <Modal.Section>
            {selectedReview ? (
              <>
                <p>
                  <strong>Customer:</strong> {selectedReview.customerName}
                </p>
                <p>
                  <strong>Rating:</strong> {selectedReview.rating}
                </p>
                <p>
                  <strong>Ttile:</strong> {selectedReview.title}
                </p>
                <p>
                  <strong>Comment:</strong> {selectedReview.comment}
                </p>
                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(selectedReview.createdAt).toLocaleDateString()}
                </p>
              </>
            ) : (
              <p>No review selected.</p>
            )}
          </Modal.Section>
        </Modal>
      </Frame>

      <div style={{ height: "500px" }}>
        <Frame>
          <Modal
            size="small"
            open={deleteConsent ? true : false}
            onClose={onClose}
            title="Delete"
            primaryAction={{
              content: "Delete",
              onAction: () => handleDeleteReview(),
              destructive: true,
            }}
            secondaryActions={[
              {
                content: "Cancel",
                onAction: onClose,
              },
            ]}
          >
            <Modal.Section>
              Are you sure to delete <strong>{deleteConsent?.title}</strong> ?
            </Modal.Section>
          </Modal>
        </Frame>
      </div>

      <div style={{ height: "500px" }}>
        <Frame>
          <Modal
            size="small"
            open={isDownloadCSV}
            onClose={() => setIsDownloadCSV(false)}
            title="Download"
            primaryAction={{
              content: "Download",
              onAction: () => handleExport(),
            }}
            secondaryActions={[
              {
                content: "Cancel",
                onAction: () => setIsDownloadCSV(false),
              },
            ]}
          >
            <Modal.Section>
              Are you want to download the <strong>CSV</strong> File ?
            </Modal.Section>
          </Modal>
        </Frame>

        <Frame>
          <Modal
            size="small"
            open={isImportCSV}
            onClose={() => setIsImportCSV(false)}
            title="Import"
            primaryAction={{
              content: "Import",
              onAction: () => setIsImportCSV(false),
              disabled: !(parsedData.length > 0),
            }}
            secondaryActions={[
              {
                content: "Cancel",
                onAction: () => setIsImportCSV(false),
              },
            ]}
          >
            <Modal.Section>
              <DropZone
                accept={[
                  ".csv",
                  ".xls",
                  ".xlsx",
                  "text/csv",
                  "application/vnd.ms-excel",
                  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                ]}
                type="file"
                onDrop={handleDropZoneDrop}
              >
                {uploadedFiles}
                {fileUpload}
              </DropZone>
            </Modal.Section>
          </Modal>
        </Frame>
      </div>
    </Page>
  );
}

function disambiguateLabel(key, value) {
  switch (key) {
    case "moneySpent":
      return `Money spent is between $${value[0]} and $${value[1]}`;
    case "taggedWith":
      return `Tagged with ${value}`;
    case "accountStatus":
      return value?.map((val) => `Customer ${val}`).join(", ");
    default:
      return value;
  }
}

function isEmpty(value) {
  if (Array.isArray(value)) {
    return value.length === 0;
  } else {
    return value === "" || value == null;
  }
}
