import { NextPage } from "next";
import { useAppBridge, withAuthorization } from "@saleor/app-sdk/app-bridge";
import { Box, Card, CardHeader, Typography } from "@material-ui/core";
import { List, ListBody, ListItem, ListItemCell } from "@saleor/macaw-ui";
import { useRouter } from "next/router";
import Link from "next/link";

const IndexPage: NextPage = () => {
  const { appBridgeState } = useAppBridge();
  const { push } = useRouter();

  return (
    <div>
      <Box mb={4}>
        <Typography variant="h1">Hey, I am app with many integrations</Typography>
      </Box>
      <Card>
        <CardHeader title="Configure integrations"></CardHeader>
        <List gridTemplate={["1fr"]}>
          <ListBody>
            <ListItem>
              <ListItemCell>
                <Link href="/integrations/one">Some integration 1</Link>
              </ListItemCell>
            </ListItem>
            <ListItem >
              <ListItemCell>
                <Link href="/integrations/two">Some integration 2</Link>
              </ListItemCell>
            </ListItem>
          </ListBody>
        </List>
      </Card>
    </div>
  );
};

export default withAuthorization()(IndexPage);
