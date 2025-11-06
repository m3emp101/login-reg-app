import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

import { useAuth } from '../context/AuthContext.jsx';
import { useCampaigns } from '../context/CampaignsContext.jsx';

const defaultValues = {
  name: '',
  slug: '',
  pageTitle: '',
  squeezePageUrl: '',
  delayPopupUrl: '',
  delayPopupWaitSeconds: '15',
  urlAfterDelayPopupCloses: '',
  exitPopupUrl: '',
  urlAfterExitPopupCloses: '',
  popupHeaderColor: '#1f2937',
};

const slugify = (value) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

const isValidUrl = (value) => {
  if (!value) {
    return false;
  }

  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch (error) {
    return false;
  }
};

export default function AddCampaign() {
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useAuth();
  const { addCampaign, getCampaignBySlug } = useCampaigns();

  const [values, setValues] = useState(defaultValues);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!loading && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlurSlug = () => {
    if (!values.slug && values.name) {
      const slugFromName = slugify(values.name);
      setValues((prev) => ({ ...prev, slug: slugFromName }));
    } else if (values.slug) {
      setValues((prev) => ({ ...prev, slug: slugify(prev.slug) }));
    }
  };

  const validate = (formValues) => {
    const validationErrors = {};

    const trimmedName = formValues.name.trim();
    const trimmedSlug = formValues.slug.trim();
    const trimmedPageTitle = formValues.pageTitle.trim();

    if (!trimmedName) {
      validationErrors.name = 'Campaign name is required.';
    }

    if (!trimmedSlug) {
      validationErrors.slug = 'URL slug is required.';
    } else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(trimmedSlug)) {
      validationErrors.slug = 'Use lowercase letters, numbers, and dashes only.';
    }

    if (!trimmedPageTitle) {
      validationErrors.pageTitle = 'Page title is required.';
    }

    if (!isValidUrl(formValues.squeezePageUrl)) {
      validationErrors.squeezePageUrl = 'Enter a valid Squeeze Page URL.';
    }

    if (!isValidUrl(formValues.delayPopupUrl)) {
      validationErrors.delayPopupUrl = 'Enter a valid Delay Popup URL.';
    }

    if (!isValidUrl(formValues.urlAfterDelayPopupCloses)) {
      validationErrors.urlAfterDelayPopupCloses = 'Enter a valid URL for when the delay popup is dismissed.';
    }

    if (!isValidUrl(formValues.exitPopupUrl)) {
      validationErrors.exitPopupUrl = 'Enter a valid Exit Popup URL.';
    }

    if (!isValidUrl(formValues.urlAfterExitPopupCloses)) {
      validationErrors.urlAfterExitPopupCloses = 'Enter a valid URL for when the exit popup is dismissed.';
    }

    if (formValues.delayPopupWaitSeconds) {
      const parsedDelay = Number(formValues.delayPopupWaitSeconds);
      if (!Number.isFinite(parsedDelay) || parsedDelay <= 0) {
        validationErrors.delayPopupWaitSeconds = 'Delay must be a positive number of seconds.';
      }
    }

    return validationErrors;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const trimmedValues = {
      ...values,
      name: values.name.trim(),
      slug: slugify(values.slug || values.name),
      pageTitle: values.pageTitle.trim(),
    };

    const validationErrors = validate(trimmedValues);
    const existingCampaign = getCampaignBySlug(trimmedValues.slug);

    if (existingCampaign) {
      validationErrors.slug = 'This slug is already in use. Choose a unique slug.';
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    const delaySeconds = Number(trimmedValues.delayPopupWaitSeconds) || 15;

    addCampaign({
      name: trimmedValues.name,
      slug: trimmedValues.slug,
      pageTitle: trimmedValues.pageTitle,
      squeezePageUrl: trimmedValues.squeezePageUrl,
      delayPopupUrl: trimmedValues.delayPopupUrl,
      delayPopupWaitSeconds: delaySeconds,
      urlAfterDelayPopupCloses: trimmedValues.urlAfterDelayPopupCloses,
      exitPopupUrl: trimmedValues.exitPopupUrl,
      urlAfterExitPopupCloses: trimmedValues.urlAfterExitPopupCloses,
      popupHeaderColor: trimmedValues.popupHeaderColor,
    });

    setValues(defaultValues);
    setIsSubmitting(false);
    navigate('/campaigns', { state: { highlightSlug: trimmedValues.slug } });
  };

  return (
    <section className="page form-page">
      <h1>Create Campaign Landing Flow</h1>
      <p>
        Configure the experience visitors see when they access your campaign URL, including timed and exit
        popups.
      </p>
      <form className="form" onSubmit={handleSubmit} noValidate>
        <label htmlFor="name">
          Campaign Name
          <input
            id="name"
            name="name"
            type="text"
            value={values.name}
            onChange={handleChange}
            placeholder="Spring Fundraiser"
            required
          />
          {errors.name ? <span className="form-error">{errors.name}</span> : null}
        </label>

        <label htmlFor="slug">
          URL Slug
          <input
            id="slug"
            name="slug"
            type="text"
            value={values.slug}
            onChange={handleChange}
            onBlur={handleBlurSlug}
            placeholder="spring-fundraiser"
            required
          />
          <small className="field-help">Visitors will load /campaigns/preview/&lt;slug&gt; for this experience.</small>
          {errors.slug ? <span className="form-error">{errors.slug}</span> : null}
        </label>

        <label htmlFor="pageTitle">
          Page Title
          <input
            id="pageTitle"
            name="pageTitle"
            type="text"
            value={values.pageTitle}
            onChange={handleChange}
            placeholder="Support Our Spring Fundraiser"
            required
          />
          {errors.pageTitle ? <span className="form-error">{errors.pageTitle}</span> : null}
        </label>

        <label htmlFor="squeezePageUrl">
          Squeeze Page URL
          <input
            id="squeezePageUrl"
            name="squeezePageUrl"
            type="url"
            inputMode="url"
            value={values.squeezePageUrl}
            onChange={handleChange}
            placeholder="https://example.org/squeeze"
            required
          />
          {errors.squeezePageUrl ? <span className="form-error">{errors.squeezePageUrl}</span> : null}
        </label>

        <label htmlFor="delayPopupUrl">
          Delay Popup URL
          <input
            id="delayPopupUrl"
            name="delayPopupUrl"
            type="url"
            inputMode="url"
            value={values.delayPopupUrl}
            onChange={handleChange}
            placeholder="https://example.org/delay-offer"
            required
          />
          {errors.delayPopupUrl ? <span className="form-error">{errors.delayPopupUrl}</span> : null}
        </label>

        <label htmlFor="delayPopupWaitSeconds">
          Delay Popup Wait (seconds)
          <input
            id="delayPopupWaitSeconds"
            name="delayPopupWaitSeconds"
            type="number"
            min="1"
            value={values.delayPopupWaitSeconds}
            onChange={handleChange}
            placeholder="15"
          />
          <small className="field-help">Defaults to 15 seconds if left blank.</small>
          {errors.delayPopupWaitSeconds ? <span className="form-error">{errors.delayPopupWaitSeconds}</span> : null}
        </label>

        <label htmlFor="urlAfterDelayPopupCloses">
          URL after Delay Popup closes
          <input
            id="urlAfterDelayPopupCloses"
            name="urlAfterDelayPopupCloses"
            type="url"
            inputMode="url"
            value={values.urlAfterDelayPopupCloses}
            onChange={handleChange}
            placeholder="https://example.org/thanks"
            required
          />
          {errors.urlAfterDelayPopupCloses ? <span className="form-error">{errors.urlAfterDelayPopupCloses}</span> : null}
        </label>

        <label htmlFor="exitPopupUrl">
          Exit Popup URL
          <input
            id="exitPopupUrl"
            name="exitPopupUrl"
            type="url"
            inputMode="url"
            value={values.exitPopupUrl}
            onChange={handleChange}
            placeholder="https://example.org/exit-offer"
            required
          />
          {errors.exitPopupUrl ? <span className="form-error">{errors.exitPopupUrl}</span> : null}
        </label>

        <label htmlFor="urlAfterExitPopupCloses">
          URL after Exit Popup closes
          <input
            id="urlAfterExitPopupCloses"
            name="urlAfterExitPopupCloses"
            type="url"
            inputMode="url"
            value={values.urlAfterExitPopupCloses}
            onChange={handleChange}
            placeholder="https://example.org/join"
            required
          />
          {errors.urlAfterExitPopupCloses ? (
            <span className="form-error">{errors.urlAfterExitPopupCloses}</span>
          ) : null}
        </label>

        <label htmlFor="popupHeaderColor">
          Popup Header Background Colour
          <input
            id="popupHeaderColor"
            name="popupHeaderColor"
            type="color"
            value={values.popupHeaderColor}
            onChange={handleChange}
          />
        </label>

        <button type="submit" className="button" disabled={isSubmitting}>
          {isSubmitting ? 'Creating…' : 'Create campaign'}
        </button>
      </form>
    </section>
  );
}

