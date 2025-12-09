const pool = require("../database/");

const reviewModel = {
  // Get all reviews for a vehicle with pagination
  async getReviewsByInventoryId(inv_id, page = 1, limit = 10, sortBy = 'newest') {
    try {
      const offset = (page - 1) * limit;
      
      let orderBy = 'r.review_date DESC';
      switch(sortBy) {
        case 'highest':
          orderBy = 'r.review_rating DESC, r.review_date DESC';
          break;
        case 'lowest':
          orderBy = 'r.review_rating ASC, r.review_date DESC';
          break;
        case 'helpful':
          orderBy = 'r.helpful_count DESC, r.review_date DESC';
          break;
      }
      
      const sql = `
        SELECT 
          r.*, 
          a.account_firstname, 
          a.account_lastname,
          a.account_email,
          COUNT(DISTINCT hv.vote_id) as vote_count,
          STRING_AGG(DISTINCT rt.tag_name, ', ') as tags
        FROM review r
        JOIN account a ON r.account_id = a.account_id
        LEFT JOIN helpful_vote hv ON r.review_id = hv.review_id
        LEFT JOIN review_tag rt ON r.review_id = rt.review_id
        WHERE r.inv_id = $1
        GROUP BY r.review_id, a.account_firstname, a.account_lastname, a.account_email
        ORDER BY ${orderBy}
        LIMIT $2 OFFSET $3
      `;
      
      const result = await pool.query(sql, [inv_id, limit, offset]);
      return result.rows;
    } catch (error) {
      console.error("getReviewsByInventoryId error", error);
      throw error;
    }
  },

  // Get average rating and review count
  async getAverageRating(inv_id) {
    try {
      const sql = `
        SELECT 
          COALESCE(AVG(review_rating), 0) as average_rating,
          COUNT(*) as review_count,
          COUNT(CASE WHEN review_rating = 5 THEN 1 END) as five_star,
          COUNT(CASE WHEN review_rating = 4 THEN 1 END) as four_star,
          COUNT(CASE WHEN review_rating = 3 THEN 1 END) as three_star,
          COUNT(CASE WHEN review_rating = 2 THEN 1 END) as two_star,
          COUNT(CASE WHEN review_rating = 1 THEN 1 END) as one_star
        FROM review 
        WHERE inv_id = $1
      `;
      const result = await pool.query(sql, [inv_id]);
      return result.rows[0];
    } catch (error) {
      console.error("getAverageRating error", error);
      throw error;
    }
  },

  // Get user's existing review for a vehicle
  async getUserReviewForVehicle(account_id, inv_id) {
    try {
      const sql = `
        SELECT r.*, STRING_AGG(rt.tag_name, ', ') as tags
        FROM review r
        LEFT JOIN review_tag rt ON r.review_id = rt.review_id
        WHERE r.account_id = $1 AND r.inv_id = $2
        GROUP BY r.review_id
      `;
      const result = await pool.query(sql, [account_id, inv_id]);
      return result.rows[0] || null;
    } catch (error) {
      console.error("getUserReviewForVehicle error", error);
      throw error;
    }
  },

  // Add a new review
  async addReview(reviewData) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      
      // Insert review
      const reviewSql = `
        INSERT INTO review (account_id, inv_id, review_rating, review_text, is_verified)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
      `;
      const reviewResult = await client.query(reviewSql, [
        reviewData.account_id,
        reviewData.inv_id,
        reviewData.review_rating,
        reviewData.review_text,
        reviewData.is_verified || false
      ]);
      
      const review = reviewResult.rows[0];
      
      // Insert tags if provided
      if (reviewData.tags && reviewData.tags.length > 0) {
        for (const tag of reviewData.tags) {
          const tagSql = `
            INSERT INTO review_tag (review_id, tag_name)
            VALUES ($1, $2)
          `;
          await client.query(tagSql, [review.review_id, tag]);
        }
      }
      
      await client.query('COMMIT');
      return review;
    } catch (error) {
      await client.query('ROLLBACK');
      console.error("addReview error", error);
      throw error;
    } finally {
      client.release();
    }
  },

  // Update a review
  async updateReview(review_id, reviewData) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      
      // Update review
      const reviewSql = `
        UPDATE review 
        SET review_rating = $1, 
            review_text = $2,
            review_date = CURRENT_TIMESTAMP
        WHERE review_id = $3 AND account_id = $4
        RETURNING *
      `;
      const reviewResult = await client.query(reviewSql, [
        reviewData.review_rating,
        reviewData.review_text,
        review_id,
        reviewData.account_id
      ]);
      
      if (reviewResult.rows.length === 0) {
        await client.query('ROLLBACK');
        return null;
      }
      
      const review = reviewResult.rows[0];
      
      // Update tags - delete old ones and insert new ones
      await client.query('DELETE FROM review_tag WHERE review_id = $1', [review_id]);
      
      if (reviewData.tags && reviewData.tags.length > 0) {
        for (const tag of reviewData.tags) {
          const tagSql = `
            INSERT INTO review_tag (review_id, tag_name)
            VALUES ($1, $2)
          `;
          await client.query(tagSql, [review_id, tag]);
        }
      }
      
      await client.query('COMMIT');
      return review;
    } catch (error) {
      await client.query('ROLLBACK');
      console.error("updateReview error", error);
      throw error;
    } finally {
      client.release();
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
      throw error;
    }
  },

  // Vote on a review as helpful
  async addHelpfulVote(review_id, account_id) {
    try {
      const sql = `
        INSERT INTO helpful_vote (review_id, account_id)
        VALUES ($1, $2)
        ON CONFLICT (review_id, account_id) DO NOTHING
        RETURNING *
      `;
      const result = await pool.query(sql, [review_id, account_id]);
      return result.rowCount > 0;
    } catch (error) {
      console.error("addHelpfulVote error", error);
      throw error;
    }
  },

  // Remove helpful vote
  async removeHelpfulVote(review_id, account_id) {
    try {
      const sql = `
        DELETE FROM helpful_vote 
        WHERE review_id = $1 AND account_id = $2
        RETURNING *
      `;
      const result = await pool.query(sql, [review_id, account_id]);
      return result.rowCount > 0;
    } catch (error) {
      console.error("removeHelpfulVote error", error);
      throw error;
    }
  },

  // Check if user has voted on a review
  async hasUserVoted(review_id, account_id) {
    try {
      const sql = `
        SELECT 1 FROM helpful_vote 
        WHERE review_id = $1 AND account_id = $2
      `;
      const result = await pool.query(sql, [review_id, account_id]);
      return result.rowCount > 0;
    } catch (error) {
      console.error("hasUserVoted error", error);
      throw error;
    }
  },

  // Get total review count for pagination
  async getTotalReviewCount(inv_id) {
    try {
      const sql = 'SELECT COUNT(*) FROM review WHERE inv_id = $1';
      const result = await pool.query(sql, [inv_id]);
      return parseInt(result.rows[0].count);
    } catch (error) {
      console.error("getTotalReviewCount error", error);
      throw error;
    }
  }
};

module.exports = reviewModel;