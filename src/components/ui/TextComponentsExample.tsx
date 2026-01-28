import React from "react";
import Text from "./Text";
import LinkText from "./LinkText";
import MetaText from "./MetaText";
import StatusText from "./StatusText";

export default function TextComponentsExample() {
  return (
    <div className="p-6 space-y-6 max-w-2xl mx-auto">
      <Text variant="h1">Text Components Examples</Text>
      
      {/* Text Component Examples */}
      <section className="space-y-3">
        <Text variant="h2">Text Component</Text>
        <Text variant="body-md">This is body text with default styling</Text>
        <Text variant="body-sm" color="muted">This is muted small text</Text>
        <Text variant="body-xs" color="accent">This is accent colored extra small text</Text>
        <Text variant="h4" weight="semibold">This is a semibold h4 heading</Text>
      </section>

      {/* LinkText Component Examples */}
      <section className="space-y-3">
        <Text variant="h3">LinkText Component</Text>
        <LinkText href="#" variant="primary">Primary link</LinkText>
        <br />
        <LinkText href="#" variant="secondary" size="sm">Small secondary link</LinkText>
        <br />
        <LinkText href="#" variant="muted" underline="always">Muted link with underline</LinkText>
        <br />
        <LinkText href="https://example.com" external>External link</LinkText>
      </section>

      {/* MetaText Component Examples */}
      <section className="space-y-3">
        <Text variant="h3">MetaText Component</Text>
        <MetaText variant="timestamp">2 hours ago</MetaText>
        <br />
        <MetaText variant="username" href="/profile/john">@john</MetaText>
        <br />
        <MetaText variant="count">42 upvotes</MetaText>
        <br />
        <MetaText variant="topic" href="/community/react">React</MetaText>
      </section>

      {/* StatusText Component Examples */}
      <section className="space-y-3">
        <Text variant="h3">StatusText Component</Text>
        <StatusText type="success">Operation completed successfully</StatusText>
        <br />
        <StatusText type="error">Something went wrong</StatusText>
        <br />
        <StatusText type="warning">Please review your input</StatusText>
        <br />
        <StatusText type="info" size="lg">Here&apos;s some helpful information</StatusText>
        <br />
        <StatusText type="success" icon={false}>Success without icon</StatusText>
      </section>
    </div>
  );
}
