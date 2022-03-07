import { useContractContext } from 'context/ContractContext';
import { useBalance } from 'utils/hooks';
import { Button } from '@chakra-ui/button';
import { FormControl, FormErrorMessage, FormLabel } from '@chakra-ui/form-control';
import { Input } from '@chakra-ui/input';
import { Box } from '@chakra-ui/layout';
import { ethers } from 'ethers';
import { Field, Form, Formik, FormikHelpers, FormikValues } from 'formik';

interface IInitialValues {
  recipient: string;
  amount: string;
}

const TransactionForm = () => {
  const balance = useBalance();
  const { ctxtWriteContract, ctxtAccount } = useContractContext();
  const initialValues: IInitialValues = { recipient: '', amount: '' };
  function handleAmountValidation(value: string) {
    let error;
    if (!value) {
      error = 'An amount is required';
    } else if (!/^\d*\.?\d{0,18}$/i.test(value)) {
      error = 'Amount must be numeric and can only contain up to 18 decimals';
    } else if (ethers.utils.parseUnits(value).gt(balance)) {
      error = 'There are not enough funds';
    }
    return error;
  }
  function handleRecipientValidation(value: string) {
    let error;
    if (!value) {
      error = 'A recipient is required';
    } else if (!/^(0x)?[0-9a-f]{40}$/i.test(value)) {
      error = 'The recipient address is invalid';
    } else if (value.toLowerCase() === ctxtAccount) {
      error = 'The recipient address matches your account address';
    }
    return error;
  }
  const handleSubmit = (values: IInitialValues, { resetForm }: FormikHelpers<IInitialValues>) => {
    transfer(values)
      .then((values) => {
        console.log(`The transaction has succeed.\n${values.amount} have been sent to ${values.recipient}`);
      })
      .catch((error) => {
        console.log(`The transaction has failed.\nError code: ${error.code}\nError message: ${error.message}`);
      })
      .finally(() => {
        resetForm();
      });
  };
  const transfer = async (values: IInitialValues) => {
    const amount = ethers.utils.parseUnits(values.amount);
    await ctxtWriteContract!.transfer(values.recipient, amount);
    return values;
  };
  return (
    <Box
      minWidth={[
        '100%', // 0-30em
        '100%', // 30em-48em
        '70%', // 48em-62em
        '50%', // 62em+
      ]}
    >
      <Formik initialValues={initialValues} onSubmit={handleSubmit}>
        {(props) => (
          <Form>
            <Field name="recipient" validate={handleRecipientValidation}>
              {({ field, form }: FormikValues) => (
                <FormControl isInvalid={form.errors.recipient && form.touched.recipient}>
                  <FormLabel>Recipient address</FormLabel>
                  <Input {...field} id="recipient" placeholder="Enter recipient" />
                  <FormErrorMessage>{form.errors.recipient}</FormErrorMessage>
                </FormControl>
              )}
            </Field>
            <Field name="amount" validate={handleAmountValidation}>
              {({ field, form }: FormikValues) => (
                <FormControl mt={3} isInvalid={form.errors.amount && form.touched.amount}>
                  <FormLabel>TFT amount</FormLabel>
                  <Input {...field} id="amount" placeholder="Enter amount" />
                  <FormErrorMessage>{form.errors.amount}</FormErrorMessage>
                </FormControl>
              )}
            </Field>
            <Button mt={4} colorScheme="teal" isLoading={props.isSubmitting} type="submit">
              Send
            </Button>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default TransactionForm;
