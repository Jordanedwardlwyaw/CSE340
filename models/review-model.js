const pool = require("../database/");

const reviewModel = {
  // Get reviews for a specific vehicle
  async getReviewsByInventoryId(inv_id) {
    try {
      const sql = `
        SELECT r.*, a.account_firstname, a.account_lastname 
        FROM review r
        JOIN account a ON r.account_id = a.account_id
        WHERE r.inv_id = $1
        ORDER BY r.review_date DESC
      `;
      const result = await pool.query(sql, [inv_id]);
      return result.rows;
    } catch (error) {
      console.error("getReviewsByInventoryId error", error);
      return [];
    }
  },

  // Get average rating for a vehicle
  async getAverageRating(inv_id) {
    try {
      const sql = `
        SELECT AVG(review_rating) as average_rating, 
               COUNT(*) as review_count
        FROM review 
        WHERE inv_id = $1
      `;
      const result = await pool.query(sql, [inv_id]);
      return result.rows[0];
    } catch (error) {
      console.error("getAverageRating error", error);
      return { average_rating: 0, review_count: 0 };
    }
  },

  // Add a new review
  async addReview(reviewData) {
    try {
      const sql = `
        INSERT INTO review (account_id, inv_id, review_rating, review_text)
        VALUES ($1, $2, $3, $4)
        RETURNING *
      `;
      const result = await pool.query(sql, [
        reviewData.account_id,
        reviewData.inv_id,
        reviewData.review_rating,
        reviewData.review_text
      ]);
      return result.rows[0];
    } catch (error) {
      console.error("addReview error", error);
      return null;
    }
  },

  // Update a review
  async updateReview(review_id, reviewData) {
    try {
      const sql = `
        UPDATE review 
        SET review_rating = $1, review_text = $2, review_date = CURRENT_TIMESTAMP
        WHERE review_id = $3 AND account_id = $4
        RETURNING *
      `;
      const result = await pool.query(sql, [
        reviewData.review_rating,
        reviewData.review_text,
        review_id,
        reviewData.account_id
      ]);
      return result.rows[0];
    } catch (error) {
      console.error("updateReview error", error);
      return null;
    }
  },

  // Delete a review
  async deleteReview(review_id, account_id) {
    try {
      const sql = `
        DELETE FROM review 
        WHERE review_id = $1 AND account_id = $2
        RETURNING *
      `;
      const result = await pool.query(sql, [review_id, account_id]);
      return result.rowCount > 0;
    } catch (error) {
      console.error("deleteReview error", error);
      return false;
    }
  },

  // Check if user has already reviewed a vehicle
  async getUserReviewForVehicle(account_id, inv_id) {
    try {
      const sql = `
        SELECT * FROM review 
        WHERE account_id = $1 AND inv_id = $2
      `;
      const result = await pool.query(sql, [account_id, inv_id]);
      return result.rows[0] || null;
    } catch (error) {
      console.error("getUserReviewForVehicle error", error);
      return null;
    }
  }
};

module.exports = reviewModel;