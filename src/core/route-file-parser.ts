/**
 * @overview
 * @author AEPKILL
 * @created 2025-02-11 17:54:08
 */

import ts from 'typescript';

interface ParsedQueryParams {
  properties: Array<
    Array<{
      name: string;
      type: string;
      optional: boolean;
    }>
  >;
}

interface ParseRouteFileResult {
  queryParams?: ParsedQueryParams;
}

let program: ts.Program;

export function parseRouteFile(filePath: string): ParseRouteFileResult {
  // 创建编译上下文
  program = ts.createProgram([filePath], {
    target: ts.ScriptTarget.Latest,
    module: ts.ModuleKind.ESNext,
  });

  const sourceFile = program.getSourceFile(filePath);
  if (!sourceFile) {
    return { queryParams: undefined };
  }

  let result: ParsedQueryParams | undefined;

  function visit(node: ts.Node) {
    // 检查是否是导出声明
    if (
      ts.isExportDeclaration(node) ||
      (ts.isTypeAliasDeclaration(node) && hasExportModifier(node)) ||
      (ts.isInterfaceDeclaration(node) && hasExportModifier(node))
    ) {
      // 处理 type 别名
      if (
        ts.isTypeAliasDeclaration(node) &&
        node.name.text === 'PageQueryParams'
      ) {
        result = parseTypeAliasDeclaration(node);
      }

      // 处理 interface
      if (
        ts.isInterfaceDeclaration(node) &&
        node.name.text === 'PageQueryParams'
      ) {
        result = parseInterfaceDeclaration(node);
      }
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);

  return {
    queryParams: result,
  };
}

function hasExportModifier(node: ts.Node): boolean {
  return (
    (ts.canHaveModifiers(node) &&
      ts
        .getModifiers(node)
        ?.some((modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword)) ??
    false
  );
}

function parseTypeAliasDeclaration(
  node: ts.TypeAliasDeclaration,
): ParsedQueryParams {
  const properties: Array<
    Array<{ name: string; type: string; optional: boolean }>
  > = [];
  const typeChecker = program.getTypeChecker();

  // 处理类型字面量
  if (ts.isTypeLiteralNode(node.type)) {
    const memberProperties: Array<{
      name: string;
      type: string;
      optional: boolean;
    }> = [];
    parseMembers(node.type.members, memberProperties);
    properties.push(memberProperties);
  }
  // 处理联合类型
  else if (ts.isUnionTypeNode(node.type)) {
    // 获取联合类型中的所有成员类型
    for (const typeNode of node.type.types) {
      const memberProperties: Array<{
        name: string;
        type: string;
        optional: boolean;
      }> = [];

      if (ts.isTypeLiteralNode(typeNode)) {
        parseMembers(typeNode.members, memberProperties);
      } else if (ts.isTypeReferenceNode(typeNode)) {
        const type = typeChecker.getTypeAtLocation(typeNode);
        const ownProperties = typeChecker.getPropertiesOfType(type);

        for (const property of ownProperties) {
          const propertyType = typeChecker.getTypeOfSymbolAtLocation(
            property,
            // biome-ignore lint/style/noNonNullAssertion: <explanation>
            property.valueDeclaration!,
          );

          memberProperties.push({
            name: property.getName(),
            type: typeChecker.typeToString(propertyType),
            optional: (property.flags & ts.SymbolFlags.Optional) !== 0,
          });
        }
      }

      if (memberProperties.length > 0) {
        properties.push(memberProperties);
      }
    }
  }
  // 处理交叉类型
  else if (ts.isIntersectionTypeNode(node.type)) {
    const memberProperties: Array<{
      name: string;
      type: string;
      optional: boolean;
    }> = [];

    for (const typeNode of node.type.types) {
      if (ts.isTypeLiteralNode(typeNode)) {
        parseMembers(typeNode.members, memberProperties);
      } else if (ts.isTypeReferenceNode(typeNode)) {
        const type = typeChecker.getTypeAtLocation(typeNode);
        const ownProperties = typeChecker.getPropertiesOfType(type);

        for (const property of ownProperties) {
          const propertyType = typeChecker.getTypeOfSymbolAtLocation(
            property,
            // biome-ignore lint/style/noNonNullAssertion: <explanation>
            property.valueDeclaration!,
          );

          memberProperties.push({
            name: property.getName(),
            type: typeChecker.typeToString(propertyType),
            optional: (property.flags & ts.SymbolFlags.Optional) !== 0,
          });
        }
      }
    }

    properties.push(memberProperties);
  }
  // 处理直接的类型引用
  else if (ts.isTypeReferenceNode(node.type)) {
    const memberProperties: Array<{
      name: string;
      type: string;
      optional: boolean;
    }> = [];
    const type = typeChecker.getTypeAtLocation(node.type);
    const ownProperties = typeChecker.getPropertiesOfType(type);

    for (const property of ownProperties) {
      const propertyType = typeChecker.getTypeOfSymbolAtLocation(
        property,
        // biome-ignore lint/style/noNonNullAssertion: <explanation>
        property.valueDeclaration!,
      );

      memberProperties.push({
        name: property.getName(),
        type: typeChecker.typeToString(propertyType),
        optional: (property.flags & ts.SymbolFlags.Optional) !== 0,
      });
    }

    properties.push(memberProperties);
  }

  return { properties };
}

function parseInterfaceDeclaration(
  node: ts.InterfaceDeclaration,
): ParsedQueryParams {
  const memberProperties: Array<{
    name: string;
    type: string;
    optional: boolean;
  }> = [];

  // 处理接口自身的成员
  parseMembers(node.members, memberProperties);

  // 处理继承的接口
  if (node.heritageClauses) {
    for (const clause of node.heritageClauses) {
      if (clause.token === ts.SyntaxKind.ExtendsKeyword) {
        for (const type of clause.types) {
          if (ts.isExpressionWithTypeArguments(type)) {
            const symbol = getTypeReferenceSymbol(type.expression);
            if (symbol) {
              parseSymbolMembers(symbol, memberProperties);
            }
          }
        }
      }
    }
  }

  return { properties: [memberProperties] };
}

function parseMembers(
  members: ts.NodeArray<ts.TypeElement> | ts.NodeArray<ts.ClassElement>,
  properties: Array<{ name: string; type: string; optional: boolean }>,
): void {
  const typeChecker = program.getTypeChecker();

  for (let i = 0; i < members.length; i++) {
    const member = members[i];
    if (ts.isPropertySignature(member)) {
      const type = member.type
        ? typeChecker.getTypeAtLocation(member.type)
        : typeChecker.getTypeAtLocation(member);

      properties.push({
        name: (member.name as ts.Identifier).text,
        type: typeChecker.typeToString(type),
        optional: member.questionToken !== undefined,
      });
    }
  }
}

function getTypeReferenceSymbol(node: ts.Node): ts.Symbol | undefined {
  const typeChecker = program.getTypeChecker();
  const symbol = typeChecker.getSymbolAtLocation(node);
  return symbol;
}

function parseSymbolMembers(
  symbol: ts.Symbol,
  properties: Array<{ name: string; type: string; optional: boolean }>,
): void {
  const typeChecker = program.getTypeChecker();
  const type = typeChecker.getDeclaredTypeOfSymbol(symbol);

  // 获取类型的所有属性
  const propertySymbols = typeChecker.getPropertiesOfType(type);

  for (const propertySymbol of propertySymbols) {
    const propertyType = typeChecker.getTypeOfSymbolAtLocation(
      propertySymbol,
      // biome-ignore lint/style/noNonNullAssertion: <explanation>
      propertySymbol.valueDeclaration!,
    );

    properties.push({
      name: propertySymbol.getName(),
      type: typeChecker.typeToString(propertyType),
      optional: (propertySymbol.flags & ts.SymbolFlags.Optional) !== 0,
    });
  }
}
