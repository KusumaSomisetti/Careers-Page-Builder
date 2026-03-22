import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpFromBracket } from "@fortawesome/free-solid-svg-icons";
import { uploadCompanyAsset } from "../../services/api";

function InputField({ label, value, onChange, placeholder, helper, type = "text" }) {
  return (
    <label className="block space-y-2">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-medium text-slate-700">{label}</span>
        {helper ? <span className="text-xs text-slate-400">{helper}</span> : null}
      </div>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-[20px] border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-300 focus:bg-white"
      />
    </label>
  );
}

function ColorField({ label, value, onChange }) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <div className="flex items-center gap-3 rounded-[20px] border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] px-3 py-3">
        <input
          type="color"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-10 w-12 rounded-xl border-0 bg-transparent p-0"
        />
        <input
          type="text"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="min-w-0 flex-1 bg-transparent text-sm text-slate-900 outline-none"
        />
      </div>
    </label>
  );
}

function MediaUrlField({ label, value, onChange, placeholder, helper, uploadLabel, disabled = false, onUpload }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  return (
    <label className="block space-y-2">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-medium text-slate-700">{label}</span>
        <span className={`text-xs ${error ? "text-rose-500" : "text-slate-400"}`}>
          {error || (uploading ? "Uploading..." : helper)}
        </span>
      </div>
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className="w-full rounded-[20px] border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] px-4 py-3.5 pr-14 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-300 focus:bg-white"
        />
        <span className="absolute right-2 top-1/2 -translate-y-1/2">
          <span className={`relative inline-flex h-10 w-10 items-center justify-center rounded-full transition ${disabled || uploading ? "cursor-not-allowed bg-slate-100 text-slate-300" : "cursor-pointer bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>
            <FontAwesomeIcon icon={faArrowUpFromBracket} />
            <input
              type="file"
              accept="image/*"
              aria-label={uploadLabel}
              disabled={disabled || uploading}
              className="absolute inset-0 cursor-pointer opacity-0 disabled:cursor-not-allowed"
              onChange={async (event) => {
                const file = event.target.files?.[0];
                if (!file) {
                  return;
                }

                setUploading(true);
                setError("");

                try {
                  const uploadedUrl = await onUpload(file);
                  onChange(uploadedUrl);
                } catch (uploadError) {
                  setError(uploadError.message || "Upload failed.");
                } finally {
                  setUploading(false);
                  event.target.value = "";
                }
              }}
            />
          </span>
        </span>
      </div>
    </label>
  );
}

export default function CompanyEditor({ company, themeSettings, banner, selectedSlug, onCompanyChange, onThemeChange, onBannerChange }) {
  const uploadsDisabled = !selectedSlug;
  const uploadHelper = uploadsDisabled ? "Save once to enable uploads" : "Paste URL or upload";

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <InputField
          label="Company name"
          value={company.name}
          onChange={(value) => onCompanyChange("name", value)}
          placeholder="Northstar"
        />
        <InputField
          label="Logo text"
          value={themeSettings.logoText}
          onChange={(value) => {
            onThemeChange("logoText", value.toUpperCase().slice(0, 3));
            onCompanyChange("logo", value.toUpperCase().slice(0, 3));
          }}
          placeholder="NS"
          helper="Up to 3 letters"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <ColorField label="Primary color" value={themeSettings.primaryColor} onChange={(value) => onThemeChange("primaryColor", value)} />
        <ColorField label="Secondary color" value={themeSettings.secondaryColor} onChange={(value) => onThemeChange("secondaryColor", value)} />
        <ColorField label="Accent color" value={themeSettings.accentColor} onChange={(value) => onThemeChange("accentColor", value)} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <InputField
          label="Banner headline"
          value={banner.headline}
          onChange={(value) => onBannerChange("headline", value)}
          placeholder="Careers at Northstar"
        />
        <MediaUrlField
          label="Banner image URL"
          value={themeSettings.bannerImageUrl}
          onChange={(value) => {
            onThemeChange("bannerImageUrl", value);
            onBannerChange("imageUrl", value);
          }}
          placeholder="https://..."
          helper={uploadHelper}
          uploadLabel="Upload banner image"
          disabled={uploadsDisabled}
          onUpload={async (file) => {
            const asset = await uploadCompanyAsset(selectedSlug, file, "banner");
            return asset.publicUrl;
          }}
        />
        <div className="sm:col-span-2">
          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-700">Banner subheadline</span>
            <textarea
              value={banner.subheadline}
              onChange={(event) => onBannerChange("subheadline", event.target.value)}
              rows={4}
              placeholder="Build thoughtful tools that help ambitious teams hire with clarity."
              className="w-full rounded-[20px] border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] px-4 py-3.5 text-sm leading-7 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-300 focus:bg-white"
            />
          </label>
        </div>
        <MediaUrlField
          label="Logo image URL"
          value={themeSettings.logoImageUrl}
          onChange={(value) => onThemeChange("logoImageUrl", value)}
          placeholder="https://..."
          helper={uploadHelper}
          uploadLabel="Upload logo image"
          disabled={uploadsDisabled}
          onUpload={async (file) => {
            const asset = await uploadCompanyAsset(selectedSlug, file, "logo");
            return asset.publicUrl;
          }}
        />
        <InputField
          label="Culture video URL"
          value={themeSettings.cultureVideoUrl}
          onChange={(value) => onThemeChange("cultureVideoUrl", value)}
          placeholder="https://..."
        />
      </div>
    </div>
  );
}
