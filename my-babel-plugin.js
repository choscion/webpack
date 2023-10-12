module.exports = function myBabelPlugin() {
  return {
    visitor: {
      // Identifier(path) {
      //   const name = path.node.name

      //   // 바벨이 만든 AST 노드를 출력한다
      //   console.log("Identifier() name:", name)

      //   // 변환작업: 코드 문자열을 역순으로 변환한다
      //   path.node.name = name
      //   .split("") // 하나하나 쪼개고
      //   .reverse() // 그걸 뒤집고
      //   .join("") // 쪼인한다?
      // },
      // https://github.com/babel/babel/blob/master/packages/babel-plugin-transform-block-scoping/src/index.js#L26
      VariableDeclaration(path) {
        console.log("VariableDeclaration() kind:", path.node.kind); // const

        // const => var 변환
        if (path.node.kind === "const") {
          path.node.kind = "var";
        }
      }
    }
  };
};
