import rrcf
import numpy as np

class RCF:
    def __init__(self, num_trees=40, tree_size=256, seed=0):
        self.num_trees = num_trees
        self.tree_size = tree_size
        self.rng = np.random.default_rng(seed)
        self.forest = [rrcf.RCTree() for _ in range(num_trees)]
        self.index = 0

    def score(self, x):
        self.index += 1
        scores = []
        for t in self.forest:
            if len(t.leaves) >= self.tree_size:
                drop_ix = self.rng.choice(list(t.leaves.keys()))
                t.forget_point(drop_ix)
            t.insert_point(x, index=self.index)
            scores.append(t.codisp(self.index))
        return float(np.mean(scores))

