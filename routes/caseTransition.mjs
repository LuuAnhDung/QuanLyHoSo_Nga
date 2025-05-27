import express from 'express';
import {
  createCaseTransition,
  getCaseTransitions,
  updateCaseTransition,
  deleteCaseTransition,
  listCasetransition
} from '../controllers/caseTransitionController.mjs';

import { ensureAuthenticated } from '../middleware/auth.mjs';

const router = express.Router();

// GET all case transitions (optionally filter by case_id)
router.get('/',ensureAuthenticated, getCaseTransitions);

router.get('/user', ensureAuthenticated, listCasetransition);

router.get('/get', ensureAuthenticated, async (req, res) => {
  // nếu bạn cần trả JSON riêng cho JS front-end
  const transitions = await getCaseTransitionsAPI(req);
  res.json(transitions);
});

// POST create a new case transition
router.post('/create', ensureAuthenticated, createCaseTransition);

// POST update a specific case transition
router.post('/edit/:id', ensureAuthenticated, updateCaseTransition);

// POST delete a specific case transition
router.post('/delete/:id', ensureAuthenticated, deleteCaseTransition);

export default router;

// import express from 'express';
// //import { getAccommodations, manageAccommodations } from '../controllers/accommodationController.mjs';
// import { ensureManagerOrAdmin} from '../middleware/authMiddleware.mjs';

// const router = express.Router();

// // router.get('/', ensureManagerOrAdmin, getAccommodations);

// // // Route for managers to manage accommodations
// // router.get('/manage', ensureManagerOrAdmin, manageAccommodations);

// export default router;