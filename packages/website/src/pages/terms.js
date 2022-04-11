import * as React from "react";
import { DomainName } from "../components/DomainName";
import { Section } from "../components/Layout";
import Seo from "../components/seo";

const P = ({ className, ...props }) => <p className={`my-4 leading-relaxed ${className}`} {...props} />;

const TermsPage = () => (
  <>
    <Seo title="Terms of Use" />

    <Section first={true} className="bg-white">
      <h1 className="capitalize">
        <DomainName /> Terms of Use
      </h1>
      <P className="text-palette-300">Last Updated: November 29, 2021</P>
      <P>
        Welcome to <DomainName />! These terms of use (the "Terms of Use") are a legal agreement between you and Skynet
        Labs, Inc., a Delaware-based corporation ("Skynet Labs", "we", "us" or "our") setting forth, among other things,
        the terms and conditions for your access and use of the <DomainName /> website, and any related sub-domains,
        operated by Skynet Labs (the "Website" or "<DomainName />
        ").
      </P>
      <P>PLEASE READ ALL THE TERMS OF USE CAREFULLY</P>
      <P>
        Use of the Website. By using the Website, you accept and agree to the provisions of the Terms of Use without any
        reservations, modifications, additions or deletions. If you do not agree to any provisions contained in the
        Terms of Use, you are not authorized to use the Website. You may be denied access to the Website, with or
        without notice to you if you do not comply with any provisions of the Terms of Use.
      </P>
      <P>
        Amendments. We may from time to time modify the Terms of Use and will post a copy of the amended Terms of Use on
        the Website, so we encourage you to review them periodically. If we make any substantial changes to the Terms of
        Use, we will notify you by sending a notice to the email address you provided or by posting a prominent notice
        on our pages. If you do not agree to, or cannot comply with, the Terms of Use as amended, you are not authorized
        to use the Website. You will be deemed to have accepted the Terms of Use as amended if you continue to use the
        Website after any amendments are posted on the Website. We reserve the right to refuse to provide our Services
        to anyone at any time.
      </P>

      <h2>1. Protection of Privacy, User Data</h2>
      <P>
        As detailed in our Privacy Policy, personal and account information will never be disclosed to third parties
        under any circumstances other than to respond to subpoenas, court orders, or other legal process, as required by
        law, or to establish or exercise our legal rights or defend against legal claims. We will never sell or share
        any of this data.
      </P>

      <h2>2. License, Restrictions and Prohibited Acts</h2>
      <P>
        Grant of License. Skynet Labs grants you a limited, nonexclusive, nontransferable, revocable license to access
        and make personal use of the Website and the Services in accordance with the terms set forth in the Terms of
        Use. Skynet Labs reserves all right, title and interest not expressly granted under this license to the fullest
        extent possible under applicable laws. You may not sublicense, assign, or transfer the license granted to you
        under the Terms of Use, and any attempt to sublicense, assign, or transfer any part of your rights under the
        Terms of Use is void.
      </P>

      <P>
        <strong>Restrictions and Prohibited Acts.</strong> So that the Website is available for all users to enjoy, you
        may not, and hereby represent, warrant and covenant that you will not or permit or enable third party to:
      </P>
      <P>
        use the Website in any way that (i) violates the terms of the Terms of Use; (ii) is unlawful, harmful,
        threatening, tortious, defamatory, libellous, abusive, obscene, invasive of another's privacy, hateful,
        fraudulent or malicious; (iii) involves the transmission of "junk mail," "chain letters," or unsolicited mass
        mailing or "spamming"; (iv) involves the sending of any virus, Trojan horse, worm, harmful code, shutdown
        mechanism or similar mechanism; (v) interferes with or disrupts the Website or any server or network involved
        with the operation of the Website; or (vi) otherwise violates any local, national or other applicable law or
        regulation; use our Services to harm, in any way, the operation of any website that you do not own or operate,
        including, without limitation, by generating recurring traffic to such website through the conduct of tests
        using our Services; modify, publish, transmit, transfer or sell, reproduce, create derivative works from,
        distribute, perform, display or in any way exploit any of the content of the Website in whole or in part, except
        as expressly permitted; or use automated tools to operate the Services on the Website (scripts, etc.).
        Sanctions. ANY USE OF THE WEBSITE NOT SPECIFICALLY PERMITTED UNDER THE TERMS OF USE IS STRICTLY PROHIBITED AND
        MAY RESULT, AT SKYNET LABS’ DISCRETION, IN THE DELETION OF YOUR DATA AND/OR THE BLACKLISTING OF YOUR IP ADDRESS.
      </P>
      <P>
        <strong>Contact.</strong> Any misuse of the Services may be reported to{" "}
        <a className="text-primary" href="mailto:report@siasky.net">
          report@siasky.net
        </a>
      </P>

      <h2>3. Service Interruptions</h2>
      <P>
        <strong>Interruptions.</strong> You acknowledge that: (i) your access to and use of the Website and/or the
        provision Services may be suspended for the duration of any unanticipated or unscheduled downtime or
        unavailability of any portion or all of the Website for any reason, including as a result of power outages,
        system failures or other interruptions; and (ii) we shall also be entitled, without any liability to you, to
        suspend access to any portion or all of the Website and/or the Services at any time (a) for scheduled downtime
        to permit us to conduct maintenance or make modifications to any service; (b) in the event of a denial of
        service attack or other attack on the Website or other event that we determine, in our sole discretion, that a
        risk to the applicable service, to you or to any of our other users may be created if the Service were not
        suspended; or (c) in the event that we determine that any Service is prohibited by law or we otherwise determine
        that it is necessary or prudent to do so for legal or regulatory reasons (collectively, "Service Suspensions").
        We shall have no liability whatsoever for any damage, liabilities, losses (including any loss of data or
        profits) or any other consequences that you may incur as a result of any Service Suspension.
      </P>
      <P>
        <strong>Watch of Interruptions.</strong> To the extent we are able, we will endeavour to post updates on the
        Website regarding any Service Suspension and resumption of service following any such suspension, but shall have
        no liability for the manner in which we may do so or if we fail to do so.
      </P>

      <h2>4. Security</h2>
      <P>
        <strong>Your Responsibility for Security.</strong> You are solely responsible for maintaining the
        confidentiality of your Account Information and for restricting access to your computer while logged into the
        Website. You agree to accept responsibility for all activities that occur under your account or from your
        computer.
      </P>

      <P>
        <strong>No Security Guarantee.</strong> We endeavour to use reasonable security measures to protect against
        unauthorized access to your account. We cannot, however, guarantee absolute security of your account or the
        personal information we collect, and we cannot promise that our security measures will prevent third party
        "hackers" from illegally accessing the Website or its contents. You agree to immediately notify Skynet Labs of
        any unauthorized use or your account, or any other breach of security, and you accept all risks of unauthorized
        access to the Website, your Account Information and any other information you provide to Skynet Labs.
      </P>
      <P>
        <strong>Disclaimer and Indemnity.</strong> Skynet Labs will not be responsible for any losses arising out of the
        unauthorized use of your account and you agree to indemnify and hold harmless Skynet Labs, its shareholders,
        officers, directors, agents, employees, partners and/or licensors, as applicable, for any improper, unauthorized
        or illegal uses of your account.
      </P>

      <h2>5. Intellectual Property</h2>
      <P>
        Trademarks and Copyright. The following are trademarks (registered or not) of Skynet Labs: "Nebulous", "Skynet",
        as well as certain other Skynet Labs trademarks, service marks, graphics, and logos (collectively, the
        "Trademarks") used in connection with the Website and the provision of Services. The Website may also contain
        third-party trademarks, service marks, graphics, and logos (collectively, the "Other Trademarks").
      </P>
      <P>
        All content displayed on the Website used in connection with the Services is the exclusive property of Skynet
        Labs or third parties and is protected by copyright laws.
      </P>
      <P>
        <strong>No License.</strong> Nothing appearing on the Website will be construed as granting you any license,
        right, title or interest relating to the Trademarks, the Other Trademarks or other intellectual property used in
        connection with the Website and/or the Services (collectively, the "Intellectual Property") and the Intellectual
        Property remains the exclusive property of Skynet Labs or owners. You agree not to copy, reproduce or use any
        Intellectual Property without our prior written consent, except for what is made available as open source under
        the MIT license by Skynet Labs on Github and Gitlab.
      </P>
      <P>
        <strong>Feedback.</strong> If you choose to communicate to us suggestions for improvements to the Website
        (collectively, "Feedback"), we shall own all right, title, and interest in and to the Feedback and we shall be
        entitled to use the Feedback without restriction. You hereby irrevocably assign all right, title and interest in
        and to the Feedback to us and waive all you moral rights in the Feedback, and agree to provide us such
        assistance as we may require to document, perfect, and maintain our rights to the Feedback. You acknowledge and
        agree that: (i) your Feedback does not contain confidential or proprietary information; (ii) Skynet Labs is not
        under any obligation of confidentiality, express or implied, with respect to the Feedback; (iii) Skynet Labs
        shall be entitled to use or disclose (or choose not to use or disclose) such Feedback for any purpose, in any
        way, in any media worldwide; (iv) Skynet Labs may have something similar to the Feedback already under
        consideration or in development; and (v) you are not entitled to any compensation or reimbursement of any kind
        from Skynet Labs under any circumstances.
      </P>

      <h2>6. Disclaimers</h2>
      <P>
        "AS IS" BASIS. THE WEBSITE (INCLUDING ALL OF THE CONTENT AND SERVICES AVAILABLE ON THE WEBSITE) ARE PROVIDED TO
        YOU "AS IS." ANY USE OF THIS WEBSITE IS AT YOUR OWN RISK. TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW,
        SKYNET LABS DISCLAIMS ALL REPRESENTATIONS, WARRANTIES OR CONDITIONS, EITHER EXPRESS OR IMPLIED, INCLUDING, BUT
        NOT LIMITED TO, IMPLIED WARRANTIES OR CONDITIONS OF MERCHANTABILITY, MERCHANTABLE QUALITY, DURABILITY, FITNESS
        FOR A PARTICULAR PURPOSE, TITLE AND NONINFRINGEMENT. SKYNET LABS MAKES NO REPRESENTATIONS, WARRANTIES OR
        GUARANTEES THAT THE WEBSITE WILL BE FREE FROM LOSS, DESTRUCTION, DAMAGE, CORRUPTION, ATTACK, VIRUSES,
        INTERFERENCE, HACKING, OR OTHER SECURITY INTRUSION, AND SKYNET LABS DISCLAIMS ANY LIABILITY RELATING THERETO.
      </P>
      <P>
        <strong>Warranty Disclaimer.</strong> SKYNET LABS MAKES NO REPRESENTATIONS, WARRANTIES OR GUARANTEES THAT THE
        USE OR THE RESULTS OF THE USE OF THE WEBSITE (INCLUDING ALL OF ITS CONTENT OR SERVICES) ARE OR WILL BE ACCURATE,
        RELIABLE, CURRENT, UNINTERRUPTED OR WITHOUT ERRORS. WITHOUT PRIOR NOTICE, SKYNET LABS MAY MODIFY, SUSPEND, OR
        DISCONTINUE ANY ASPECT OR FEATURE OF THE WEBSITE OR YOUR USE OF THIS WEBSITE. IF SKYNET LABS ELECTS TO MODIFY,
        SUSPEND, OR DISCONTINUE THE WEBSITE, IT WILL NOT BE LIABLE TO YOU OR ANY THIRD PARTY.
      </P>
      <h2>7. Limitation of Liability and Indemnity</h2>
      <P>
        <strong>Limitation of Liability.</strong> IN NO CASE WILL SKYNET LABS, ITS OFFICERS, DIRECTORS, SHAREHOLDERS,
        AGENTS, LICENSORS OR EMPLOYEES BE LIABLE FOR ANY INDIRECT, SPECIAL, CONSEQUENTIAL, EXEMPLARY, PUNITIVE DAMAGES
        OR OTHER DAMAGES, OR FOR ANY LOSSES, DAMAGES, LIABILITIES, COSTS AND EXPENSES ARISING OUT OF OR RELATING TO YOUR
        USE OF THE WEBSITE, REGARDLESS OF THE CAUSE OF ACTION (WHETHER IN CONTRACT, WARRANTY, DELICT, QUASI-DELICT,
        TORT, NEGLIGENCE, STRICT LIABILITY OR ANY OTHER THEORY OF LIABILITY) AND EVEN IF SKYNET LABS HAS BEEN ADVISED OF
        THE POSSIBILITY OF SUCH DAMAGES.
      </P>
      <P>
        <strong>Indemnity.</strong> YOU WILL INDEMNIFY AND HOLD SKYNET LABS, ITS OFFICERS, DIRECTORS, SHAREHOLDERS,
        AGENTS, LICENSORS AND EMPLOYEE HARMLESS WITH RESPECT TO ANY SUITS, CLAIMS OR DEMANDS (INCLUDING REASONABLE
        LAWYERS' FEES) ARISING OUT OF (I) YOUR BREACH OF THESE TERMS OF USE; (II) ANY DAMAGES BY YOU OR YOUR USE OF THE
        WEBSITE CAUSED TO A THIRD PARTY; OR (III) YOUR USE OR MISUSE OF THE WEBSITE AND/OR THE SERVICES.
      </P>

      <h2>8. Privacy Policy</h2>
      <P>
        Your use of the Website is also subject to <DomainName /> Privacy Policy (the "Privacy Policy"), which is
        incorporated by reference and made a part of the Terms of Use. It is important that you read and understand the
        terms of our Privacy Policy.
      </P>

      <h2>9. General</h2>
      <P>
        <strong>No Partnership.</strong> No agency, partnership, joint venture, or employment is created between you and
        Skynet Labs as a result of the Terms of Use and you do not have any authority of any kind to bind Skynet Labs in
        any respect whatsoever.
      </P>
      <P>
        <strong>Applicable Law; Jurisdiction.</strong> The Terms of Use shall be governed by and construed in accordance
        with the laws of Delaware, applicable to agreements made and entirely to be performed within Delaware, excluding
        any rules of private international law or the conflict of laws which would lead to the application of any other
        laws. Regardless of where you access this site, you agree that any action at law or in equity arising out of or
        relating to these Terms of Use shall be filed and adjudicated only in the federal or provincial courts located
        in Delaware, and you hereby irrevocably and unconditionally consent and attorn to the exclusive jurisdiction and
        venue of such courts over any suit, action or proceeding arising out of these Terms of Use.
      </P>
      <P>
        <strong>Severability.</strong> If any of the provisions of the Terms of Use or their application is found to be
        invalid under any applicable statute or rule or law, they are, to that extent, deemed omitted and the validity
        of the other provisions of the Terms of Use will not be affected.
      </P>
      <P>
        <strong>Questions.</strong> If you have any questions regarding the Terms of Use or wish to report any issue
        relating to the Website, its content or the Services you were provided, please contact us by email at{" "}
        <a className="text-primary" href="mailto:hello@siasky.net">
          hello@siasky.net
        </a>
        .
      </P>
    </Section>
  </>
);

export default TermsPage;
