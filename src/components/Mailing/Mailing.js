import React from "react";
import MailchimpSubscribe from "react-mailchimp-subscribe";
import classNames from "classnames";

import "./Mailing.scss";

const url = "https://tech.us11.list-manage.com/subscribe/post?u=5df238d9e852f9801b5f2c92e&amp;id=ab6bea4cc2";

const CustomForm = ({ status, message, onValidated, light, id }) => {
  let email, user;

  const checkboxId = `${id}-check`;
  const submitId = `${id}-submit`;

  const submit = () => {
    if ((email, user, email.value.indexOf("@") > -1)) {
      onValidated({
        EMAIL: email.value,
        USER: user.checked ? "Yes" : "No"
      });
    }
  };

  return (
    <form className={classNames("home-stay-form", { light })} onSubmit={e => e.preventDefault()}>
      <input
        ref={node => (email = node)}
        type="email"
        placeholder="Email Address"
        validate="true"
        aria-labelledby={submitId}
      />
      <div className="home-form-stay-existing">
        <input ref={node => (user = node)} type="checkbox" id={checkboxId} />
        <label htmlFor={checkboxId}>I have previous experience using Sia</label>
      </div>
      <button className="button" onClick={submit} id={submitId}>
        Get Updates
      </button>

      {status === "sending" && <p className="message">sending...</p>}
      {status === "error" && <p className="message red-text" dangerouslySetInnerHTML={{ __html: message }} />}
      {status === "success" && <p className="message" dangerouslySetInnerHTML={{ __html: message }} />}
    </form>
  );
};

export default function Mailing({ light, id }) {
  return (
    <MailchimpSubscribe
      url={url}
      render={({ subscribe, status, message }) => (
        <CustomForm
          id={id}
          status={status}
          message={message}
          light={light}
          onValidated={formData => subscribe(formData)}
        />
      )}
    />
  );
}
