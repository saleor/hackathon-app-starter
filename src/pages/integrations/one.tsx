import { NextPage } from "next";
import { withAuthorization } from "@saleor/app-sdk/app-bridge";
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
import {Button} from "@saleor/macaw-ui";

type Values = {
  token: string;
  booleanOption: boolean;
};

const IntegrationOne: NextPage = () => {
  const { register, handleSubmit } = useForm<Values>({
    defaultValues: { token: "", booleanOption: false },
  });

  return (
    <div>
      <Typography variant="h2" style={{marginBottom: 30}}>Integration One</Typography>
      <Card>
        <CardHeader title="Configure"></CardHeader>
        <form
          onSubmit={handleSubmit((values) => {
            console.log(values);
          })}
        >
          <div style={{ padding: '0 30px 30px' }}>
            <TextField label="Example token" {...register("token")} fullWidth />
            <FormControlLabel
              control={<Checkbox {...register("booleanOption")} />}
              label="Some option"
            />
            <Button type="submit" style={{display: 'block'}} variant="primary">Save</Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default withAuthorization()(IntegrationOne);
