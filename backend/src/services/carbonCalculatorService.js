/**
 * Carbon Calculator Service
 * Automatically calculates carbon emissions
 * Formula: Emission = Quantity × Emission Factor
 */

/**
 * Calculate carbon emission
 * @param {number} quantity - Quantity of resource consumed
 * @param {number} factor - Emission factor
 * @returns {number} Calculated emission rounded to 2 decimal places
 */
export const calculateEmission = (quantity, factor) => {
  const startTime = Date.now();
  const functionName = 'calculateEmission';

  try {
    // Validate inputs
    validateEmissionInputs(quantity, factor);

    // Calculate emission
    const emission = quantity * factor;
    const roundedEmission = Math.round(emission * 100) / 100;

    // Log success
    const executionTime = Date.now() - startTime;
    console.log(`[CARBON CALCULATOR] ${functionName} - Success - Execution Time: ${executionTime}ms - Result: ${roundedEmission}`);

    return roundedEmission;
  } catch (error) {
    // Log failure
    const executionTime = Date.now() - startTime;
    console.error(`[CARBON CALCULATOR] ${functionName} - Failure - Execution Time: ${executionTime}ms - Error: ${error.message}`);
    throw error;
  }
};

/**
 * Calculate emission for a transaction object
 * @param {Object} transaction - Transaction object with quantity and emissionFactor
 * @returns {number} Calculated emission
 */
export const calculateTransactionEmission = (transaction) => {
  const startTime = Date.now();
  const functionName = 'calculateTransactionEmission';

  try {
    // Validate transaction object
    if (!transaction || typeof transaction !== 'object') {
      throw new Error('Transaction must be a valid object');
    }

    if (transaction.quantity === undefined || transaction.quantity === null) {
      throw new Error('Transaction quantity is required');
    }

    // Handle both populated and unpopulated emissionFactor
    let factor;
    if (typeof transaction.emissionFactor === 'object' && transaction.emissionFactor !== null) {
      factor = transaction.emissionFactor.factor;
    } else {
      throw new Error('Emission factor data is required');
    }

    if (factor === undefined || factor === null) {
      throw new Error('Emission factor value is required');
    }

    // Calculate emission
    const emission = calculateEmission(transaction.quantity, factor);

    // Log success
    const executionTime = Date.now() - startTime;
    console.log(`[CARBON CALCULATOR] ${functionName} - Success - Execution Time: ${executionTime}ms - Transaction ID: ${transaction._id || 'N/A'}`);

    return emission;
  } catch (error) {
    // Log failure
    const executionTime = Date.now() - startTime;
    console.error(`[CARBON CALCULATOR] ${functionName} - Failure - Execution Time: ${executionTime}ms - Error: ${error.message}`);
    throw error;
  }
};

/**
 * Validate emission calculation inputs
 * @param {number} quantity - Quantity value
 * @param {number} factor - Emission factor value
 * @throws {Error} If inputs are invalid
 */
export const validateEmissionInputs = (quantity, factor) => {
  // Check for null/undefined
  if (quantity === null || quantity === undefined) {
    throw new Error('Quantity cannot be null or undefined');
  }

  if (factor === null || factor === undefined) {
    throw new Error('Emission factor cannot be null or undefined');
  }

  // Check for valid numbers
  if (typeof quantity !== 'number' || isNaN(quantity)) {
    throw new Error('Quantity must be a valid number');
  }

  if (typeof factor !== 'number' || isNaN(factor)) {
    throw new Error('Emission factor must be a valid number');
  }

  // Check for negative values
  if (quantity < 0) {
    throw new Error('Quantity cannot be negative');
  }

  if (factor < 0) {
    throw new Error('Emission factor cannot be negative');
  }

  return true;
};

/**
 * Calculate total emissions for multiple transactions
 * @param {Array} transactions - Array of transactions
 * @returns {Object} Total and breakdown
 */
export const calculateTotalEmissions = (transactions) => {
  const startTime = Date.now();
  const functionName = 'calculateTotalEmissions';

  try {
    if (!Array.isArray(transactions)) {
      throw new Error('Transactions must be an array');
    }

    if (transactions.length === 0) {
      return { total: 0, count: 0, breakdown: [] };
    }

    const breakdown = transactions.map((transaction) => ({
      id: transaction._id,
      source: transaction.source,
      emission: transaction.calculatedEmission || 0,
    }));

    const total = breakdown.reduce((sum, item) => sum + item.emission, 0);
    const roundedTotal = Math.round(total * 100) / 100;

    // Log success
    const executionTime = Date.now() - startTime;
    console.log(`[CARBON CALCULATOR] ${functionName} - Success - Execution Time: ${executionTime}ms - Total: ${roundedTotal}`);

    return {
      total: roundedTotal,
      count: transactions.length,
      breakdown,
    };
  } catch (error) {
    // Log failure
    const executionTime = Date.now() - startTime;
    console.error(`[CARBON CALCULATOR] ${functionName} - Failure - Execution Time: ${executionTime}ms - Error: ${error.message}`);
    throw error;
  }
};
