"use client";

import { type ReactNode, Fragment } from "react";
import { WhisperableWord, isWhisperable } from "./whisperable-word";

/**
 * Wraps text content, automatically detecting and converting
 * whisperable words into <WhisperableWord> components.
 * Non-whisperable words remain plain text nodes.
 *
 * @example
 * <WhisperText>
 *   I painted my prayers on walls no one could see
 * </WhisperText>
 */
export function WhisperText({ children, className = "" }: { children: string; className?: string }): ReactNode {
  // Split by whitespace but preserve the delimiters
  const tokens = children.split(/(\s+)/);

  return (
    <span className={className}>
      {tokens.map((token, i) => {
        if (/^\s+$/.test(token)) {
          return <Fragment key={i}>{token}</Fragment>;
        }

        // Strip trailing punctuation for matching, re-attach for display
        const trailingPunct = token.match(/([.,!?;:'")\]]+)$/);
        const strippedWord = trailingPunct ? token.slice(0, -trailingPunct[1].length) : token;

        if (isWhisperable(strippedWord)) {
          return (
            <Fragment key={i}>
              <WhisperableWord>{strippedWord}</WhisperableWord>
              {trailingPunct ? <span>{trailingPunct[1]}</span> : null}
            </Fragment>
          );
        }

        return <Fragment key={i}>{token}</Fragment>;
      })}
    </span>
  );
}