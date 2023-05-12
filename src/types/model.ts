import { RawFile } from './file';

export type Model = {
  id: string;
  object: string;
  hyperparams: Hyperparams;
  organization_id: string;
  result_files: RawFile[];
  training_files: RawFile[];
  model: string;
  created_at: number;
  updated_at: number;
  status: string;
  fine_tuned_model?: string;
};

export type Hyperparams = {
  n_epochsL: number;
  batch_sizeL: number;
  prompt_loss_weightL: number;
  learning_rate_multiplierL: number;
};
