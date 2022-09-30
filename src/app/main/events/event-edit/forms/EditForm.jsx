import Router from 'next/router';
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useFormik } from 'formik';
import * as yup from 'yup';
import {
  FormHelperText,
  Stack,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Button,
} from '@mui/material';
import TextField from '@mui/material/TextField';
import Box from '@mui/system/Box';

import * as constants from 'src/constants';
import CustomTextField from 'components/Form/CustomTextField';
import EventService from 'services/events';
import { showMessage } from 'app/store/fuse/messageSlice';

function EmailForm({ formRef, event, error }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [recordPk, setRecordPk] = useState(null);
  const [partyPk, setPartyPk] = useState(null);

  const validationSchema = yup.object({
    title: yup.string('Enter the subject').required('Subject is required'),
    description: yup
      .string('Enter the content')
      .required('Content is required'),
  });

  useEffect(() => {
    if (event && event.recordpk) {
      setRecordPk(event.recordpk);
    }
    if (event && event.partypk) {
      setPartyPk(event.partypk);
    }
  }, [event]);

  const formik = useFormik({
    initialValues: {
      title: event.title || '',
      description: event.description || '',
      currency: event.pricecurrency || constants.currencyList[0],
      price: event.unitprice || 0.1,
      enabled: !!event.recordenabled || true,
      private: !!event.visibility || false,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      if (loading) return;

      if (recordPk) {
        values.recordPk = recordPk;
      }

      if (partyPk) {
        values.partyPk = partyPk;
      }
      setLoading(true);
      EventService.saveEvent(values)
        .then((res) => {
          dispatch(
            showMessage({ message: 'Saved successfully.', variant: 'success' })
          );
          setRecordPk(res.event.recordpk);
          setLoading(false);
          Router.push('/events');
        })
        .catch(() => {
          setLoading(false);
          dispatch(showMessage({ message: 'Failed save.', variant: 'error' }));
        });
    },
  });

  return (
    <Stack
      component="form"
      spacing={3}
      sx={{
        float: 'left',
        width: {
          md: 600,
        },
        mx: 'auto',
        padding: 4,
      }}
      noValidate
      autoComplete="off"
      onSubmit={formik.handleSubmit}
      method="post"
    >
      <CustomTextField
        type="text"
        name="title"
        label="Title *"
        formik={formik}
        disabled={loading}
      />

      <TextField
        id="description"
        name="description"
        label="Description *"
        multiline
        rows={2}
        disabled={loading}
        onChange={formik.handleChange}
        defaultValue={formik.values.description}
        helperText={formik.touched.description && formik.errors.description}
        error={formik.touched.description && Boolean(formik.errors.description)}
      />

      <Stack direction="row" spacing={2}>
        <TextField
          select
          id="currency"
          name="currency"
          label="Currency"
          sx={{ width: '50%' }}
          disabled={loading}
          value={formik.values.currency}
          onChange={formik.handleChange}
          helperText={formik.touched.currency && formik.errors.currency}
          error={formik.touched.currency && Boolean(formik.errors.currency)}
        >
          {constants.currencyList.map((label) => (
            <MenuItem key={label} value={label}>
              {label}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          id="price"
          label="Price"
          type="number"
          sx={{ width: '50%' }}
          inputProps={{ style: { textAlign: 'right' } }}
          disabled={loading}
          onChange={formik.handleChange}
          defaultValue={formik.values.price}
          helperText={formik.touched.price && formik.errors.price}
          error={formik.touched.price && Boolean(formik.errors.price)}
        />
      </Stack>

      <Stack direction="row" spacing={2}>
        <FormControlLabel
          control={
            <Checkbox
              checked={formik.values.enabled}
              onChange={formik.handleChange}
              name="enabled"
            />
          }
          label="Enabled"
          sx={{ pl: 2, width: '50%' }}
        />

        <FormControlLabel
          control={
            <Checkbox
              checked={formik.values.private}
              onChange={formik.handleChange}
              name="private"
            />
          }
          label="Private"
          sx={{ width: '50%' }}
        />
      </Stack>

      {error && <FormHelperText error>{error}</FormHelperText>}

      <Box>
        <Button ref={formRef} type="submit" sx={{ display: 'none' }} />
      </Box>
    </Stack>
  );
}

export default EmailForm;
