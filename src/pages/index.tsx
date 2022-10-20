import { NextPage } from "next";
import { withAuthorization } from "@saleor/app-sdk/app-bridge";
import { Card, CardHeader, Typography } from "@material-ui/core";
import { List, ListBody, ListItem, ListItemCell } from "@saleor/macaw-ui";
import Link from "next/link";

const IndexPage: NextPage = () => {
  return (
    <div>
      <Typography style={{ marginBottom: 30 }} variant="h1">
        Hey, I am app with many integrations
      </Typography>
      <Card>
        <CardHeader title="Configure integrations"></CardHeader>
        <List gridTemplate={["1fr"]}>
          <ListBody>
            <ListItem>
              <ListItemCell>
                <Link href="/integrations/one">Some integration 1</Link>
              </ListItemCell>
            </ListItem>
            <ListItem>
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
