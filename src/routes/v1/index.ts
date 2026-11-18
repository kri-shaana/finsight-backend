import { Router } from 'express';
import healthRoutes from '../../modules/health/health.routes';

const router = Router();

router.use('/health', healthRoutes);

// Future routes registered here:
// router.use('/auth', authRoutes);
// router.use('/users', userRoutes);
// router.use('/reconciliations', reconciliationRoutes);

export default router;
