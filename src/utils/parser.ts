import jsep, { Expression } from "jsep";

interface ValidationResult {
  valid: boolean;
  errors: string[];
  variables: string[];
}

export function validateExpression(expr: string): ValidationResult {
  const ALLOWED_OPERATORS = new Set([
    "+",
    "-",
    "*",
    "/",
    "**",
    ">",
    ">=",
    "<",
    "<=",
    "==",
    "!=",
  ]);

  try {
    const ast: Expression = jsep(expr);
    const errors: string[] = [];
    const variables: Set<string> = new Set();

    if (expr.includes("(") || expr.includes(")")) {
      errors.push(`Parentheses in expressions are not allowed: "${expr}".`);
    }

    if (expr.includes("and") || expr.includes("or")) {
      errors.push(`Logical operators (AND/OR) are not allowed: "${expr}".`);
    }

    const traverse = (node: Expression): void => {
      const binaryNode = node as any;

      if (node.type === "BinaryExpression") {
        if (binaryNode.operator === "||" || binaryNode.operator === "&&") {
          errors.push(`Logical operators (AND/OR) are not allowed: ${expr}.`);
        } else if (!ALLOWED_OPERATORS.has(binaryNode.operator)) {
          errors.push(
            `Operator "${binaryNode.operator}" is not allowed: ${expr}.`
          );
        }
      } else if (node.type === "Identifier") {
        if (typeof node.name === "string") {
          variables.add(node.name);
        }
      } else if (node.type === "Literal") {
        return;
      } else {
        errors.push(`Invalid expression type: "${node.type}" is not allowed.`);
      }

      if (binaryNode.left) traverse(binaryNode.left);
      if (binaryNode.right) traverse(binaryNode.right);
    };

    traverse(ast);

    return {
      valid: errors.length === 0,
      errors,
      variables: Array.from(variables),
    };
  } catch (err) {
    return {
      valid: false,
      errors: [err instanceof Error ? err.message : "Unknown error"],
      variables: [],
    };
  }
}

export default validateExpression;
