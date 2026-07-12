/**
 * Workflow Configurations
 * Define workflow states and allowed transitions for each entity type
 * Add new workflows here as needed
 */

/**
 * Challenge Workflow
 * States: Draft → Active → Under Review → Completed
 * Archived can be reached from any state
 */
const challengeWorkflow = {
  states: ['Draft', 'Active', 'Under Review', 'Completed', 'Archived'],
  
  transitions: {
    Draft: ['Active', 'Archived'],
    Active: ['Under Review', 'Archived'],
    'Under Review': ['Completed', 'Active', 'Archived'],
    Completed: ['Archived'],
    Archived: [], // Terminal state - no transitions allowed from here
  },
  
  initialState: 'Draft',
};

/**
 * Workflow Registry
 * Maps entity types to their workflow configurations
 */
const workflows = {
  challenge: challengeWorkflow,
  challenges: challengeWorkflow, // Support both singular and plural
  // Add more workflows here as needed:
  // csrActivity: csrActivityWorkflow,
  // csrActivities: csrActivityWorkflow,
  // compliance: complianceWorkflow,
  // audit: auditWorkflow,
};

/**
 * Get workflow configuration by entity type
 * @param {string} entityType - Type of entity (e.g., 'challenge')
 * @returns {Object|null} Workflow configuration or null if not found
 */
export const getWorkflow = (entityType) => {
  return workflows[entityType] || null;
};

/**
 * Check if entity type has a workflow
 * @param {string} entityType - Type of entity
 * @returns {boolean} True if workflow exists
 */
export const hasWorkflow = (entityType) => {
  return !!workflows[entityType];
};

/**
 * Get all available workflows
 * @returns {Object} All workflow configurations
 */
export const getAllWorkflows = () => {
  return workflows;
};

export default workflows;
