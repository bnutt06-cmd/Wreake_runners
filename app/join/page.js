"use client";

import ContentPage, { P, H2, H3 } from "@/components/ContentPage";
import { COLORS } from "@/lib/data";

const card = {
  background: "#fff",
  border: "1px solid " + COLORS.mist,
  borderRadius: 14,
  padding: 22,
};

const feeRow = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "baseline",
  gap: 12,
  padding: "12px 0",
  borderBottom: "1px solid " + COLORS.mist,
};

export default function JoinPage() {
  return (
    <ContentPage
      kicker="JOIN US"
      title="Join Wreake Runners"
      intro="Whatever your pace or experience, there's a place for you at Team Wreake. Here's everything you need to know about becoming a member."
    >
      <P>
        We're a friendly, inclusive club based in Syston, welcoming runners of every
        ability &mdash; from complete beginners through to seasoned club racers. Membership
        includes all club nights and track nights, with no additional weekly or monthly
        costs.
      </P>

      <H2>Membership types &amp; fees</H2>
      <P>
        Membership runs from 1st March each year. There are three ways to be part of the
        club:
      </P>

      <div style={{ display: "grid", gap: 16, margin: "8px 0 8px" }}>
        <div style={card}>
          <div style={feeRow}>
            <strong style={{ fontSize: 17, color: COLORS.ink }}>Affiliated Adult Runner</strong>
            <span style={{ fontSize: 20, fontWeight: 800, color: COLORS.teal, whiteSpace: "nowrap" }}>&pound;48<span style={{ fontSize: 13, fontWeight: 600 }}>/yr</span></span>
          </div>
          <p style={{ margin: "12px 0 0", fontSize: 15, lineHeight: 1.6, color: "#444" }}>
            Made up of &pound;25 Wreake membership plus &pound;23 for England Athletics (EA)
            affiliation. You don't have to be EA affiliated to run with us or race as a
            Wreake, but it brings benefits &mdash; including a discount off many races (enter
            a few across the year and you can earn the cost back), and entry to the London
            Marathon club ballot after 12 months' membership.
          </p>
        </div>

        <div style={card}>
          <div style={feeRow}>
            <strong style={{ fontSize: 17, color: COLORS.ink }}>Non-Affiliated / 2nd Claim Runner</strong>
            <span style={{ fontSize: 20, fontWeight: 800, color: COLORS.teal, whiteSpace: "nowrap" }}>&pound;25<span style={{ fontSize: 13, fontWeight: 600 }}>/yr</span></span>
          </div>
          <p style={{ margin: "12px 0 0", fontSize: 15, lineHeight: 1.6, color: "#444" }}>
            Already a member of another club but want to join us as second claim? This is for
            you. If you're already an EA member, that simply carries on. As a second-claim
            member you can't race for us in events your first-claim club also enters, but
            you're very welcome at all our club nights, including track.
          </p>
        </div>

        <div style={card}>
          <div style={feeRow}>
            <strong style={{ fontSize: 17, color: COLORS.ink }}>Social (Non-Running) Member</strong>
            <span style={{ fontSize: 20, fontWeight: 800, color: COLORS.green, whiteSpace: "nowrap" }}>Free</span>
          </div>
          <p style={{ margin: "12px 0 0", fontSize: 15, lineHeight: 1.6, color: "#444" }}>
            Join as a social, non-running member at no cost. This gives you access to the
            private Facebook forum and club-only social events. It's typically for members'
            partners, or members taking a personal break who plan to rejoin in future.
          </p>
        </div>
      </div>

      <div style={{ background: COLORS.mist, borderRadius: 12, padding: "14px 18px", fontSize: 14, color: COLORS.ink, margin: "4px 0 8px" }}>
        <strong>Joining between now and the end of February?</strong> Please get in touch
        before transferring any payment, so we can sort your membership year correctly.
      </div>

      <H2>New to running? Try our Couch to 5K</H2>
      <P>
        Our "Get Into Running" Couch to 5K course runs in April, and it's the perfect
        starting point if you're new to running or coming back after a break. Details will
        be posted soon &mdash; email{" "}
        <a href="mailto:info@wreakerunners.co.uk" style={{ color: COLORS.teal, fontWeight: 600 }}>info@wreakerunners.co.uk</a>{" "}
        to register your interest.
      </P>

      <H2>How to join</H2>
      <P>There are two easy ways to become a member:</P>

      <H3>1. Register by email</H3>
      <P>
        The quickest way to get started is to drop us a line &mdash; we'll send you the
        membership form and help you take the first step.
      </P>
      <div style={{ margin: "4px 0 16px" }}>
        <a
          href="mailto:info@wreakerunners.co.uk"
          style={{ display: "inline-block", background: COLORS.ink, color: "#fff", padding: "12px 22px", borderRadius: 10, fontWeight: 700, fontSize: 15, textDecoration: "none" }}
        >
          Email the club to join
        </a>
      </div>
      <p style={{ fontSize: 14, color: "#6b7280", margin: "0 0 8px" }}>
        An online registration form is coming soon to this page. In the meantime, email or
        the printable form below are the ways to sign up.
      </p>

      <H3>2. Download &amp; post the form</H3>
      <P>
        Prefer paper? Download the registration form, complete and sign it, and either post
        it or hand it to a committee member. Pay your fees by BACS using your name as the
        reference.
      </P>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, margin: "4px 0 12px" }}>
        <a href="/membership-form-2026.pdf" download style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#fff", border: "1px solid " + COLORS.mist, color: COLORS.ink, padding: "11px 18px", borderRadius: 10, fontWeight: 600, fontSize: 14, textDecoration: "none" }}>
          &#8595; 2026/27 Membership Form (PDF)
        </a>
        <a href="/introductory-membership-form-2026.pdf" download style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#fff", border: "1px solid " + COLORS.mist, color: COLORS.ink, padding: "11px 18px", borderRadius: 10, fontWeight: 600, fontSize: 14, textDecoration: "none" }}>
          &#8595; 2026/27 Introductory Membership Form (PDF)
        </a>
      </div>
      <P>
        Please send completed, signed forms to: <strong>Lyndsey Wilson, 27 Steeple Drive,
        Brooksby, Leicestershire, LE14 2DA</strong>.
      </P>

      <H2>Paying your fees (BACS)</H2>
      <P>After registering, please pay your fees by bank transfer to:</P>
      <div style={{ ...card, background: COLORS.paper }}>
        <div style={{ display: "grid", gap: 8, fontSize: 15 }}>
          <div><strong>Account name:</strong> Wreake Runners</div>
          <div><strong>Sort code:</strong> 20-52-69</div>
          <div><strong>Account number:</strong> 10001007</div>
        </div>
        <p style={{ margin: "14px 0 0", fontSize: 14, color: "#a15c00", background: "#fff7e6", border: "1px solid #ffe2a8", borderRadius: 8, padding: "10px 12px" }}>
          <strong>Important:</strong> please use your surname (or as many letters of it as
          will fit) as the payment reference, so we can match your payment to your membership.
        </p>
      </div>

      <H2>Privacy</H2>
      <P>
        Any information you give will not be shared with any outside organisation, except
        England Athletics for affiliation purposes, and where necessary any governing bodies
        or race organisations/leagues for entering or producing and storing results. Your
        data is shared within the club for planning, organising, training, racing and social
        events. Information held by the club may be kept for up to 2 years after a member has
        resigned.
      </P>
    </ContentPage>
  );
}
