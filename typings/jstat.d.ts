declare module "jstat" {
  namespace jStat {
    export namespace studentt {
      /**
       * Returns the value of p in the inverse of the cdf for the Student's
       * T distribution with dof degrees of freedom.
       * @param p P-value
       * @param dof Degrees of freedom
       */
      export function inv(p: number, dof: number): number;
    }

    export namespace binomial {
      /**
       * Returns the value of k in the cdf of the Binomial distribution with
       * parameters n and p.
       * @param k
       * @param n
       * @param p
       */
      export function cdf(k: number, n: number, p: number): number;
    }
  }
}
