import { NextPage } from "next";
import { useAppBridge, withAuthorization } from "@saleor/app-sdk/app-bridge";
import {
  Box,
  Card,
  CardHeader,
  Checkbox,
  FormControlLabel,
  TextField,
  Typography,
} from "@material-ui/core";
import { useForm } from "react-hook-form";
import { Button } from "@saleor/macaw-ui";
import { useRouter } from "next/router";
import { SALEOR_AUTHORIZATION_BEARER_HEADER, SALEOR_DOMAIN_HEADER } from "@saleor/app-sdk/const";
import { useEffect, useState } from "react";

type Values = {
  token: string;
  booleanOption: boolean;
};

const IntegrationOne: NextPage = () => {
  const { push } = useRouter();
  const [loading, setLoading] = useState(true);
  const { register, handleSubmit, setValue } = useForm<Values>({
    defaultValues: { token: "", booleanOption: false },
  });
  const { appBridgeState } = useAppBridge();

  useEffect(() => {
    fetch("/api/integrations/one/metadata", {
      method: "GET",
      headers: [
        ["content-type", "application/json"],
        [SALEOR_DOMAIN_HEADER, appBridgeState?.domain!],
        [SALEOR_AUTHORIZATION_BEARER_HEADER, appBridgeState?.token!],
      ],
    })
      .then((r) => r.json())
      .then((response) => {
        setValue("token", response.data.token ?? "");
        setValue("booleanOption", response.data.booleanOption ?? false);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <Button
        onClick={() => {
          push("/");
        }}
        style={{ display: "block", marginBottom: 30 }}
        variant="secondary"
      >
        Back
      </Button>
      <Typography variant="h2" style={{ marginBottom: 30 }}>
        Integration One
      </Typography>
      <Card>
        <CardHeader title="Configure"></CardHeader>
        <form
          onSubmit={handleSubmit((values) => {
            console.log(values);

            fetch("/api/integrations/one/metadata", {
              method: "POST",
              body: JSON.stringify(values),
              headers: [
                ["content-type", "application/json"],
                [SALEOR_DOMAIN_HEADER, appBridgeState?.domain!],
                [SALEOR_AUTHORIZATION_BEARER_HEADER, appBridgeState?.token!],
              ],
            });
          })}
        >
          <div style={{ padding: "0 30px 30px" }}>
            <TextField variant="standard" disabled={loading} label="Example token" {...register("token")} fullWidth />
            <FormControlLabel
              disabled={loading}
              control={<Checkbox {...register("booleanOption")} />}
              label="Some option"
            />
            <Button disabled={loading} type="submit" style={{ display: "block" }} variant="primary">
              Save
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default withAuthorization()(IntegrationOne);
