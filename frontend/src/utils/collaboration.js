/**
 * Collaboration Utilities
 * Real-time collaboration features for AfriVerse
 */

// Collaborative editing session management
export class CollaborationSession {
  constructor(documentId, userId) {
    this.documentId = documentId
    this.userId = userId
    this.participants = new Map()
    this.cursor = null
    this.selection = null
  }

  // Add participant to session
  addParticipant(participant) {
    this.participants.set(participant.id, {
      ...participant,
      joinedAt: new Date().toISOString(),
      cursor: null,
      selection: null
    })
  }

  // Remove participant from session
  removeParticipant(participantId) {
    this.participants.delete(participantId)
  }

  // Update participant cursor position
  updateCursor(participantId, position) {
    const participant = this.participants.get(participantId)
    if (participant) {
      participant.cursor = position
      participant.lastActivity = new Date().toISOString()
    }
  }

  // Update participant selection
  updateSelection(participantId, selection) {
    const participant = this.participants.get(participantId)
    if (participant) {
      participant.selection = selection
      participant.lastActivity = new Date().toISOString()
    }
  }

  // Get all active participants
  getActiveParticipants() {
    return Array.from(this.participants.values())
  }

  // Check if participant is active (activity in last 5 minutes)
  isParticipantActive(participantId) {
    const participant = this.participants.get(participantId)
    if (!participant) return false

    const lastActivity = new Date(participant.lastActivity || participant.joinedAt)
    const now = new Date()
    const diffMinutes = (now - lastActivity) / 1000 / 60
    return diffMinutes < 5
  }
}

// Operational Transformation for concurrent editing
export class OperationalTransform {
  // Transform operations for concurrent editing
  static transform(op1, op2) {
    // Simple OT implementation
    // In production, use a library like ShareDB or Yjs
    if (op1.type === 'insert' && op2.type === 'insert') {
      if (op1.position < op2.position) {
        return { ...op2, position: op2.position + op1.text.length }
      } else if (op1.position > op2.position) {
        return { ...op1, position: op1.position + op2.text.length }
      }
    } else if (op1.type === 'delete' && op2.type === 'delete') {
      if (op1.position < op2.position) {
        return { ...op2, position: op2.position - op1.length }
      } else if (op1.position > op2.position) {
        return { ...op1, position: op1.position - op2.length }
      }
    } else if (op1.type === 'insert' && op2.type === 'delete') {
      if (op1.position <= op2.position) {
        return { ...op2, position: op2.position + op1.text.length }
      }
    } else if (op1.type === 'delete' && op2.type === 'insert') {
      if (op2.position <= op1.position) {
        return { ...op1, position: op1.position + op2.text.length }
      }
    }
    return op2
  }

  // Apply operation to document
  static apply(document, operation) {
    switch (operation.type) {
      case 'insert':
        return document.slice(0, operation.position) + 
               operation.text + 
               document.slice(operation.position)
      case 'delete':
        return document.slice(0, operation.position) + 
               document.slice(operation.position + operation.length)
      case 'replace':
        return document.slice(0, operation.position) + 
               operation.text + 
               document.slice(operation.position + operation.length)
      default:
        return document
    }
  }
}

// Conflict resolution strategies
export const ConflictResolution = {
  // Last write wins
  lastWriteWins: (localVersion, remoteVersion) => {
    return remoteVersion.timestamp > localVersion.timestamp 
      ? remoteVersion 
      : localVersion
  },

  // Merge changes
  mergeChanges: (localVersion, remoteVersion, baseVersion) => {
    // Simple 3-way merge
    const localChanges = diff(baseVersion.content, localVersion.content)
    const remoteChanges = diff(baseVersion.content, remoteVersion.content)
    
    return {
      content: applyChanges(baseVersion.content, [...localChanges, ...remoteChanges]),
      conflicts: detectConflicts(localChanges, remoteChanges)
    }
  },

  // Manual resolution required
  requiresManualResolution: (localVersion, remoteVersion) => {
    return {
      resolved: false,
      localVersion,
      remoteVersion,
      message: 'Manual conflict resolution required'
    }
  }
}

// Simple diff implementation
function diff(text1, text2) {
  const changes = []
  let i = 0, j = 0

  while (i < text1.length || j < text2.length) {
    if (text1[i] !== text2[j]) {
      if (j < text2.length) {
        changes.push({ type: 'insert', position: i, text: text2[j] })
        j++
      } else {
        changes.push({ type: 'delete', position: i, length: 1 })
        i++
      }
    } else {
      i++
      j++
    }
  }

  return changes
}

// Apply changes to text
function applyChanges(text, changes) {
  let result = text
  for (const change of changes) {
    result = OperationalTransform.apply(result, change)
  }
  return result
}

// Detect conflicting changes
function detectConflicts(localChanges, remoteChanges) {
  const conflicts = []
  
  for (const local of localChanges) {
    for (const remote of remoteChanges) {
      if (isOverlapping(local, remote)) {
        conflicts.push({ local, remote })
      }
    }
  }
  
  return conflicts
}

// Check if changes overlap
function isOverlapping(change1, change2) {
  const end1 = change1.position + (change1.length || change1.text?.length || 0)
  const end2 = change2.position + (change2.length || change2.text?.length || 0)
  
  return !(end1 <= change2.position || end2 <= change1.position)
}

// Presence awareness (show who's online)
export class PresenceManager {
  constructor() {
    this.users = new Map()
  }

  // Update user presence
  updatePresence(userId, status) {
    this.users.set(userId, {
      userId,
      status, // 'online', 'away', 'offline'
      lastSeen: new Date().toISOString(),
      cursor: null,
      selection: null
    })
  }

  // Get online users
  getOnlineUsers() {
    return Array.from(this.users.values())
      .filter(user => user.status === 'online')
  }

  // Remove user
  removeUser(userId) {
    this.users.delete(userId)
  }

  // Update user cursor/selection
  updateUserActivity(userId, activity) {
    const user = this.users.get(userId)
    if (user) {
      this.users.set(userId, {
        ...user,
        ...activity,
        lastSeen: new Date().toISOString()
      })
    }
  }
}

// Comment and annotation management
export class CommentManager {
  constructor() {
    this.comments = new Map()
    this.commentId = 1
  }

  // Add comment
  addComment(content, userId, selection) {
    const comment = {
      id: this.commentId++,
      content,
      userId,
      selection,
      timestamp: new Date().toISOString(),
      resolved: false,
      replies: []
    }
    this.comments.set(comment.id, comment)
    return comment
  }

  // Reply to comment
  replyToComment(commentId, content, userId) {
    const comment = this.comments.get(commentId)
    if (comment) {
      comment.replies.push({
        id: Date.now(),
        content,
        userId,
        timestamp: new Date().toISOString()
      })
    }
  }

  // Resolve comment
  resolveComment(commentId) {
    const comment = this.comments.get(commentId)
    if (comment) {
      comment.resolved = true
      comment.resolvedAt = new Date().toISOString()
    }
  }

  // Get all comments
  getComments() {
    return Array.from(this.comments.values())
  }

  // Get unresolved comments
  getUnresolvedComments() {
    return Array.from(this.comments.values())
      .filter(comment => !comment.resolved)
  }
}

// Version control for documents
export class VersionControl {
  constructor() {
    this.versions = []
    this.currentVersion = 0
  }

  // Save version
  saveVersion(content, userId, message) {
    const version = {
      id: this.versions.length + 1,
      content,
      userId,
      message: message || 'Auto-save',
      timestamp: new Date().toISOString(),
      changes: this.versions.length > 0 
        ? diff(this.versions[this.versions.length - 1].content, content) 
        : []
    }
    this.versions.push(version)
    this.currentVersion = version.id
    return version
  }

  // Get version
  getVersion(versionId) {
    return this.versions.find(v => v.id === versionId)
  }

  // Revert to version
  revertToVersion(versionId) {
    const version = this.getVersion(versionId)
    if (version) {
      this.currentVersion = versionId
      return version.content
    }
    return null
  }

  // Get version history
  getHistory() {
    return this.versions
  }

  // Compare versions
  compareVersions(versionId1, versionId2) {
    const v1 = this.getVersion(versionId1)
    const v2 = this.getVersion(versionId2)
    
    if (v1 && v2) {
      return diff(v1.content, v2.content)
    }
    return []
  }
}

// Real-time notification system
export const CollaborationNotifications = {
  // User joined
  userJoined: (user) => ({
    type: 'user_joined',
    message: `${user.name} joined the session`,
    user,
    timestamp: new Date().toISOString()
  }),

  // User left
  userLeft: (user) => ({
    type: 'user_left',
    message: `${user.name} left the session`,
    user,
    timestamp: new Date().toISOString()
  }),

  // Content changed
  contentChanged: (user) => ({
    type: 'content_changed',
    message: `${user.name} made changes`,
    user,
    timestamp: new Date().toISOString()
  }),

  // Comment added
  commentAdded: (user, comment) => ({
    type: 'comment_added',
    message: `${user.name} added a comment`,
    user,
    comment,
    timestamp: new Date().toISOString()
  }),

  // Version saved
  versionSaved: (user, version) => ({
    type: 'version_saved',
    message: `${user.name} saved version ${version.id}`,
    user,
    version,
    timestamp: new Date().toISOString()
  })
}

// Export utility functions
export default {
  CollaborationSession,
  OperationalTransform,
  ConflictResolution,
  PresenceManager,
  CommentManager,
  VersionControl,
  CollaborationNotifications
}
