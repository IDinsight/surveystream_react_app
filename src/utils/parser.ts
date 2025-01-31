import jsep, { Expression } from "jsep";

interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export function validateExpression(expr: string): ValidationResult {
  try {
    const ast: Expression = jsep(expr);
    const errors: string[] = [];

    if (expr.includes("(") || expr.includes(")")) {
      errors.push(`Parentheses in expressions are not allowed: "${expr}".`);
    }

    if (expr.includes("and") || expr.includes("or")) {
      errors.push(`Logical operators (AND/OR) are not allowed: "${expr}".`);
    }

    const traverse = (node: Expression): void => {
      if (
        node.type === "BinaryExpression" &&
        ((node as any).operator === "||" || (node as any).operator === "&&")
      ) {
        errors.push(`Logical operators (AND/OR) are not allowed: ${expr}.`);
      }

      if ((node as any).left) traverse((node as any).left);
      if ((node as any).right) traverse((node as any).right);
      if ((node as any).argument) traverse((node as any).argument);
    };

    traverse(ast);

    return {
      valid: errors.length === 0,
      errors,
    };
  } catch (err) {
    return {
      valid: false,
      errors: [err instanceof Error ? err.message : "Unknown error"],
    };
  }
}

export default validateExpression;
