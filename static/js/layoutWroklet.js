// From https://github.com/GoogleChromeLabs/houdini-samples

registerLayout('masonry', class {
    static get inputProperties() {
      return [ '--padding', '--columns' ];
    }
    static get childrenInputProperties() {
      return ['--x', '--y']
    }
    *intrinsicSizes(children, edges, styleMap) { 
      console.log(children, edges);
      /* TODO implement :) */
    }
    *layout(children, edges, constraints, styleMap) {
      console.log(styleMap);
      // console.log(children, edges, constraints, styleMap);
      const inlineSize = constraints.fixedInlineSize;
      const padding = parseInt(styleMap.get('--padding'));
      const columnValue = styleMap.get('--columns');
  
      // We also accept 'auto', which will select the BEST number of columns.
      let columns = parseInt(columnValue);
      if (columnValue == 'auto' || !columns) {
        columns = Math.ceil(inlineSize / 350); // MAGIC NUMBER o/.
      }
      // Layout all children with simply their column size.
      const childInlineSize = (inlineSize - ((columns + 1) * padding)) / columns;
      const childFragments = yield children.map((child) => {
        // LayoutChild  
        // console.log(child.styleMap);
        // console.log(child.layoutNextFragment);
        return child.layoutNextFragment({fixedInlineSize: childInlineSize});
      });
      // console.log(childFragments);
      let autoBlockSize = 0;
      const columnOffsets = Array(columns).fill(0);
      for (let childFragment of childFragments) {
        // console.log(columnOffsets);
        // Select the column with the least amount of stuff in it.
        const min = columnOffsets.reduce((acc, val, idx) => {
          if (!acc || val < acc.val) {
            // console.log(idx, val);
            return {idx, val};
          }
          return acc;
        }, {val: +Infinity, idx: -1});
        // console.log(min)
        childFragment.inlineOffset = padding + (childInlineSize + padding) * min.idx;
        childFragment.blockOffset = padding + min.val;
        // console.log(childFragment.blockOffset)
        columnOffsets[min.idx] = childFragment.blockOffset + childFragment.blockSize;
        autoBlockSize = Math.max(autoBlockSize, columnOffsets[min.idx] + padding);
      }
      console.log(childFragments);
      return {
        autoBlockSize,
        childFragments
      };
    }
  });
  
  /**
   * Copyright 2018 Google Inc. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *     http://www.apache.org/licenses/LICENSE-2.0
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */