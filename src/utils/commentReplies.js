/** @typedef {{ reply_id: string, reply_to_reply_id?: string, children?: ReplyNode[] } & Record<string, unknown>} ReplyNode */

/**
 * Nest flat reply_list items by reply_to_reply_id.
 * Direct replies to the parent comment use reply_to_reply_id of "0" or missing.
 * @param {Array<Record<string, unknown>>|null|undefined} replies
 * @returns {ReplyNode[]}
 */
export function organizeReplies(replies) {
  if (!replies?.length) return [];

  const nodes = replies.map((reply) => ({
    ...reply,
    children: [],
  }));
  const byId = new Map(nodes.map((node) => [node.reply_id, node]));
  const roots = [];

  for (const node of nodes) {
    const parentReplyId = node.reply_to_reply_id;
    if (parentReplyId && parentReplyId !== '0' && byId.has(parentReplyId)) {
      byId.get(parentReplyId).children.push(node);
    } else {
      roots.push(node);
    }
  }

  return roots;
}

export function getHiddenReplyCount(comment) {
  const total = comment.reply_count ?? 0;
  const shown = comment.reply_list?.length ?? 0;
  return total > shown ? total - shown : 0;
}
