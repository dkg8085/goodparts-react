import React, { useEffect, useState } from "react";
import { MoonLoader } from "react-spinners";
import { useDispatch, useSelector } from "react-redux";
import { contactUsInfo } from "../redux/thunks/contactUsFetchInfoThunk";
import { submitContactForm } from "../redux/thunks/contactUsThunk";
import { setFormData, resetForm } from "../redux/slices/contactUsSlice";

const ContactUs = () => {
  const dispatch = useDispatch();

  const {
    loading: fieldsLoading,
    data: formFields,
    error: fieldsError,
  } = useSelector((state) => state.contactInfo);

  const {
    formData,
    loading: submitLoading,
    success,
    error: submitError,
  } = useSelector((state) => state.contact);

  const [contactUSSuccess, setContactUSSuccess] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    dispatch(contactUsInfo());
  }, [dispatch]);

  useEffect(() => {
    if (success) {
      setContactUSSuccess(true);
    }
  }, [success]);

  useEffect(() => {
    if (formData["10"]) {
      setUserEmail(formData["10"]);
    }
  }, [formData]);

  const handleChange = (e, fieldId) => {
    dispatch(setFormData({ fieldId, value: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(submitContactForm(formData)).then((action) => {
      if (action.meta.requestStatus === "fulfilled") {
        dispatch(resetForm());
      }
    });
  };

  return (
    <section className="contact-us">
      <div className="container">
        <div className="row">
          <div className="col-lg-8">
            <div className="heading-section">
              <h2>
                Please use the form below for your questions, comments, or
                concerns:
              </h2>
            </div>

            {fieldsLoading ? (
              <div className="loader-overlay">
                <MoonLoader color="#15273B" size={50} />
              </div>
            ) : fieldsError ? (
              <p className="text-center text-danger">{fieldsError}</p>
            ) : contactUSSuccess ? (
              <div className="submit-msg">
                <h3>Thanks for contacting us!</h3>
                <p>
                  A confirmation email was sent to <strong>{userEmail}</strong>.
                </p>
                <p>We’ll get back to you as soon as possible.</p>
              </div>
            ) : (
              <div className="form-wrapper">
                {" "}
                {/* form-wrap p-4 rounded shadow bg-white */}
                <form onSubmit={handleSubmit}>
                  {formFields.map((field) =>
                    field.type !== "submit" ? (
                      <div key={field.id} className="mb-4 form-control-wrap">
                        <label>
                          {field.label} {field.required && <span>*</span>}
                        </label>
                        {field.type === "textbox" || field.type === "email" ? (
                          <input
                            className="form-control"
                            type={field.type === "textbox" ? "text" : "email"}
                            name={field.name}
                            value={formData[field.id] || ""}
                            onChange={(e) => handleChange(e, field.id)}
                            required={field.required}
                          />
                        ) : field.type === "textarea" ? (
                          <textarea
                            className="form-control"
                            name={field.name}
                            rows="5"
                            value={formData[field.id] || ""}
                            onChange={(e) => handleChange(e, field.id)}
                            required={field.required}
                          />
                        ) : null}
                      </div>
                    ) : null,
                  )}

                  {formFields.some((field) => field.type === "submit") && (
                    <div className="log-btn text-center">
                      <button
                        type="submit"
                        className="login-button btn btn-primary"
                        disabled={submitLoading}
                      >
                        {submitLoading ? (
                          <MoonLoader color="#fff" size={15} />
                        ) : (
                          "Submit"
                        )}
                      </button>
                    </div>
                  )}
                </form>
                {submitError && (
                  <p className="text-center text-danger mt-3">{submitError}</p>
                )}
              </div>
            )}
          </div>
          <div className="col-lg-4">
            <div className="location-section">
              <h2>
                United Stations
                
                Media Networks
              </h2>

              <p>
                485 Madison Avenue (3rd Floor)
                <br />
                New York, NY 10022
              </p>

              <p>
                <span>Phone:</span> (212) 869-1111
                <br />
                <span>Fax:</span> (212) 869-1115
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactUs;
