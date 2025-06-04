import React from 'react';
import {
  Box,
  Button,
  TextField,
  IconButton,
  Typography,
  Paper,
  Container,
} from '@mui/material';
import { FieldArray, Formik, Form } from 'formik';
import * as Yup from 'yup';
import { Add, Delete} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';





const sheetUrl = "https://script.google.com/macros/s/AKfycbwc_IPBuyRQgR9CPB9CVte-_wXnVIJ9LqcC0sPkBXSP-uoR-7l7dPbxUGMSjSjBWALu/exec";

// Validation schema using Yup
const validationSchema = Yup.object().shape({
  invoiceNumber: Yup.string().required('Required'),
  invoiceDate: Yup.date().required('Required'),
  deliveryDate: Yup.date().required('Required'),
  transporter: Yup.string().required('Required'),
  docketNumber: Yup.string().required('Required'),
  items: Yup.array()
    .of(
      Yup.object().shape({
        productCode: Yup.string().required('Required'),
        quantity: Yup.number().required('Required').min(1),
        imeis: Yup.array()
          .of(Yup.string().required('Required'))
          .min(1, 'At least one IMEI required'),
      })
    )
    .min(1, 'At least one item required'),
});

export default function InvoiceForm() {
  const navigate = useNavigate();
  const location = useLocation();


  const isEdit = location.state?.editMode || false;
  const existingData = location.state?.formData || null;

  
  const initialValues = existingData
    ? {
        ...existingData,
        items: Array.isArray(existingData.items)
          ? existingData.items.map((item) => ({
              productCode: item.productCode || '',
              quantity: item.quantity || '',
              imeis: Array.isArray(item.imeis)
                ? item.imeis
                : typeof item.imeis === 'string'
                ? item.imeis.split(',').map((i) => i.trim())
                : [''],
            }))
          : [
              {
                productCode: '',
                quantity: '',
                imeis: [''],
              },
            ],
      }
    : {
        invoiceNumber: '',
        invoiceDate: '',
        deliveryDate: '',
        transporter: '',
        docketNumber: '',
        items: [
          {
            productCode: '',
            quantity: '',
            imeis: [''],
          },
        ],
      };

      const handleSubmit = async (values, { resetForm }) => {
        try {
          if (isEdit && existingData?.invoiceNumber) {
            // Delete old invoice first
            await fetch(sheetUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                action: 'DELETE',
                invoiceNumber: existingData.invoiceNumber
              }),
            });
          }
        
          // Now add new/updated invoice
          await fetch(sheetUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            mode: 'no-cors',
            body: JSON.stringify(values),
          });
      
          alert('Invoice saved successfully!');
          resetForm();
          navigate('/');
        } catch (error) {
          console.error('Error:', error);
          alert('Failed to save invoice.');
        }
      };

      

  return (
    <Container maxWidth="md">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, errors, touched, handleChange }) => (
          <Form autoComplete="off">
            <Box component={Paper} p={3} my={4}>
              <Typography variant="h6">Invoice Details</Typography>
              <TextField
                fullWidth
                label="Invoice Number"
                name="invoiceNumber"
                value={values.invoiceNumber}
                onChange={handleChange}
                error={touched.invoiceNumber && Boolean(errors.invoiceNumber)}
                helperText={touched.invoiceNumber && errors.invoiceNumber}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Invoice Date"
                type="date"
                name="invoiceDate"
                value={values.invoiceDate}
                onChange={handleChange}
                error={touched.invoiceDate && Boolean(errors.invoiceDate)}
                helperText={touched.invoiceDate && errors.invoiceDate}
                InputLabelProps={{ shrink: true }}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Delivery Date"
                type="date"
                name="deliveryDate"
                value={values.deliveryDate}
                onChange={handleChange}
                error={touched.deliveryDate && Boolean(errors.deliveryDate)}
                helperText={touched.deliveryDate && errors.deliveryDate}
                InputLabelProps={{ shrink: true }}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Transporter"
                name="transporter"
                value={values.transporter}
                onChange={handleChange}
                error={touched.transporter && Boolean(errors.transporter)}
                helperText={touched.transporter && errors.transporter}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Docket Number"
                name="docketNumber"
                value={values.docketNumber}
                onChange={handleChange}
                error={touched.docketNumber && Boolean(errors.docketNumber)}
                helperText={touched.docketNumber && errors.docketNumber}
                margin="normal"
              />
            </Box>

            <FieldArray name="items">
              {({ push, remove }) => (
                <Box>
                  {values.items.map((item, index) => (
                    <Box key={index} component={Paper} p={3} my={2}>
                      <Typography variant="h6">Item {index + 1}</Typography>
                      <TextField
                        fullWidth
                        label="Product Code"
                        name={`items[${index}].productCode`}
                        value={item.productCode}
                        onChange={handleChange}
                        error={
                          touched.items?.[index]?.productCode &&
                          Boolean(errors.items?.[index]?.productCode)
                        }
                        helperText={
                          touched.items?.[index]?.productCode &&
                          errors.items?.[index]?.productCode
                        }
                        margin="normal"
                      />
                      <TextField
                        fullWidth
                        label="Quantity"
                        type="number"
                        name={`items[${index}].quantity`}
                        value={item.quantity}
                        onChange={handleChange}
                        error={
                          touched.items?.[index]?.quantity &&
                          Boolean(errors.items?.[index]?.quantity)
                        }
                        helperText={
                          touched.items?.[index]?.quantity &&
                          errors.items?.[index]?.quantity
                        }
                        margin="normal"
                      />

                      <FieldArray name={`items[${index}].imeis`}>
                        {({ push: pushImei, remove: removeImei }) => (
                          <Box>
                            <Typography variant="subtitle1">IMEIs</Typography>
                            {item.imeis.map((imei, j) => (
                              <Box
                                key={j}
                                display="flex"
                                alignItems="center"
                                gap={1}
                                mb={1}
                              >
                                <TextField
                                  fullWidth
                                  label={`IMEI ${j + 1}`}
                                  name={`items[${index}].imeis[${j}]`}
                                  value={imei}
                                  onChange={handleChange}
                                  error={
                                    touched.items?.[index]?.imeis?.[j] &&
                                    Boolean(errors.items?.[index]?.imeis?.[j])
                                  }
                                  helperText={
                                    touched.items?.[index]?.imeis?.[j] &&
                                    errors.items?.[index]?.imeis?.[j]
                                  }
                                />
                                {item.imeis.length > 1 && (
                                  <IconButton
                                    onClick={() => removeImei(j)}
                                    color="error"
                                  >
                                    <Delete />
                                  </IconButton>
                                )}
                              </Box>
                            ))}
                            <Button
                              type="button"
                              variant="outlined"
                              startIcon={<Add />}
                              onClick={() => pushImei('')}
                            >
                              Add IMEI
                            </Button>
                          </Box>
                        )}
                      </FieldArray>

                      <Box mt={2}>
                        {values.items.length > 1 && (
                          <Button
                            type="button"
                            variant="contained"
                            color="error"
                            startIcon={<Delete />}
                            onClick={() => remove(index)}
                          >
                            Remove Item
                          </Button>
                        )}
                      </Box>
                    </Box>
                  ))}

                  <Button
                    type="button"
                    variant="contained"
                    onClick={() =>
                      push({ productCode: '', quantity: '', imeis: [''] })
                    }
                    startIcon={<Add />}
                  >
                    Add Item
                  </Button>
                </Box>
              )}
            </FieldArray>

            <Box mt={4} display="flex" gap={2}>
            <Button variant="contained"
                color="default"
                onClick={() => navigate('/')}>
                Cancel
              </Button>
              <Button type="submit" variant="contained" color="primary">
                Submit Form
              </Button>
              {!isEdit && (
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => navigate('/')}
                >
                  Back to Invoice Table
                </Button>

              )}
              
            </Box>
          </Form>
        )}
      </Formik>
    </Container>
  );
}






