<template>
  <div class="sku">
    <!-- <div style="font-weight: bold; margin: 20px 0">sku算法-实现商品多规格</div> -->
		<zz-title title="sku算法-实现商品多规格" style="font-weight: bold; margin: 20px 0"></zz-title>
    <a-form-model ref="form" :model="formData">
      <div class="standard-list">
        <div
          v-for="(item, index) in formData.standardsList"
          :key="index"
          class="standard"
        >
          <a-icon
            v-if="formData.standardsList.length > 1"
            @click="deleteStandard(index)"
            type="close-circle"
            style="
              position: absolute;
              right: -5px;
              top: -5px;
              z-index: 99;
              cursor: pointer;
            "
          />
          <a-form-model-item
            label="规格名"
            :label-col="{ span: 4 }"
            :wrapper-col="{ span: 18 }"
            :rules="[
              {
                validator: (rule, value, callback) => {
                  validateName(
                    rule,
                    value,
                    callback,
                    item.name,
                    index,
                    formData.standardsList
                  );
                },
                trigger: ['change', 'blur'],
              },
              { required: true, message: '请输入规格名' },
            ]"
            :prop="'standardsList.' + index + '.name'"
          >
            <a-input v-model.trim="item.name" placeholder="请输入规格名" />
            <!-- @blur="standardBlur(item.name)" -->
          </a-form-model-item>
          <a-row>
            <a-col
              :span="4"
              style="text-align: right; height: 40px; line-height: 40px"
              >规格值：</a-col
            >
            <a-col :span="18" style="display: flex; flex-wrap: wrap">
              <div
                v-for="(child, childIndex) in item.children"
                :key="childIndex"
                style="width: 25%; position: relative"
              >
                <a-icon
                  v-if="item.children.length > 2"
                  @click="deleteStandardValue(index, childIndex)"
                  type="close-circle"
                  style="
                    position: absolute;
                    right: 5px;
                    top: 0;
                    z-index: 99;
                    cursor: pointer;
                  "
                />
                <a-form-model-item
                  label="规格值"
                  :label-col="{ span: 0 }"
                  :wrapper-col="{ span: 20 }"
                  :rules="[
                    {
                      validator: (rule, value, callback) => {
                        validateName(
                          rule,
                          value,
                          callback,
                          child.name,
                          childIndex,
                          item.children
                        );
                      },
                      trigger: ['change', 'blur'],
                    },
                    { required: true, message: '请输入规格值' },
                  ]"
                  :prop="
                    'standardsList.' +
                    index +
                    '.children.' +
                    childIndex +
                    '.name'
                  "
                >
                  <a-input
                    v-model.trim="child.name"
                    placeholder="请输入规格值"
                  />
                  <!-- @blur="standardValueBlur(child.name, item.children)" -->
                </a-form-model-item>
              </div>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="4" style="text-align: right"></a-col>
            <a-col :span="18">
              <a-button @click="addStandardChild(item)">添加规格值</a-button>
            </a-col>
          </a-row>
        </div>
        <a-button @click="addStandards" type="primary">添加规格</a-button>
      </div>
      <div class="goods">
        <a-table
          :columns="columns"
          :dataSource="formData.goodsList"
          :rowKey="(record, index) => index"
          :pagination="false"
          bordered
        >
          <!-- <template
            v-for="stand in formData.standardsList"
            :slot="stand.name"
            slot-scope="key, item"
          >
            {{ item[stand.name] }}
          </template> -->
          <template slot="price" slot-scope="key, item, index">
            <a-form-model-item
              :label-col="{ span: 0 }"
              :wrapper-col="{ span: 20 }"
              :rules="[{ required: true, message: '请输入现价' }]"
              :prop="'goodsList.' + index + '.price'"
            >
              <a-input-number
                v-model="formData.goodsList[index].price"
                placeholder="请输入现价"
                style="width:100%"
              />
            </a-form-model-item>
          </template>
          <template slot="cost" slot-scope="key, item, index">
            <a-form-model-item
              :label-col="{ span: 0 }"
              :wrapper-col="{ span: 20 }"
              :rules="[{ required: true, message: '请输入成本' }]"
              :prop="'goodsList.' + index + '.cost'"
            >
              <a-input-number
                v-model="formData.goodsList[index].cost"
                placeholder="请输入成本"
                style="width:100%"
              />
            </a-form-model-item>
          </template>
          <template slot="stock" slot-scope="key, item, index">
            <a-form-model-item
              :label-col="{ span: 0 }"
              :wrapper-col="{ span: 20 }"
              :rules="[{ required: true, message: '请输入库存' }]"
              :prop="'goodsList.' + index + '.stock'"
            >
              <a-input-number
                v-model="formData.goodsList[index].stock"
                placeholder="请输入库存"
                style="width:100%"
              />
            </a-form-model-item>
          </template>
        </a-table>
      </div>
    </a-form-model>

    <a-button
      type="primary"
      style="position: absolute; right: 20px; top: 20px"
      @click="save"
      >保存</a-button
    >
  </div>
</template>

<script>
export default {
  name: "sku",
  data() {
    return {
      formData: {
        standardsList: [
          {
            name: "",
            children: [{ name: "" }, { name: "" }],
          },
        ], // 规格列表
        goodsList: [], // 商品列表
      },
      columns: [
        {
          title: "现价",
          dataIndex: "price",
          scopedSlots: { customRender: "price" },
          width: 100,
          align: "center",
        },
        {
          title: "成本",
          dataIndex: "cost",
          scopedSlots: { customRender: "cost" },
          width: 100,
          align: "center",
        },
        {
          title: "库存",
          dataIndex: "stock",
          scopedSlots: { customRender: "stock" },
          width: 100,
          align: "center",
        },
      ],
    };
  },
  watch: {
    "formData.standardsList": {
      handler(val, oldVal) {
        console.log("formData.standardsList----------changed", val);
        this.formData.goodsList = this.getSkuList(val);
      },
      deep: true,
    },
  },
  created() {},
  methods: {
    // 添加规格
    addStandards() {
      let newStandard = {
        name: "",
        children: [{ name: "" }, { name: "" }],
      };
      let canAdd = true;
      this.formData.standardsList.forEach((item) => {
        if (!item.name) {
          canAdd = false;
        }
        if (item.children) {
          item.children.forEach((item1) => {
            if (!item1.name) {
              canAdd = false;
            }
          });
        }
      });
      if (!canAdd) {
        this.$message.error("请先完成已添加的规格后再操作");
        return;
      }

      if (this.formData.standardsList.length < 4) {
        this.formData.standardsList.push(newStandard);
      } else {
        this.$message.error("最多添加4个规格");
      }
    },
    // 删除规格值
    deleteStandard(index) {
      this.formData.standardsList = this.formData.standardsList.filter(
        (item, ind) => {
          return index !== ind;
        }
      );
    },
    // 添加规格值
    addStandardChild(obj) {
      console.log(obj);
      let child = { name: "" };
      if (obj.children.length < 4) {
        obj.children.push(child);
      } else {
        this.$message.error("最多添加4个规格值");
      }
    },
    // 删除规格值
    deleteStandardValue(index, childIndex) {
      this.formData.standardsList[index].children = this.formData.standardsList[
        index
      ].children.filter((item, ind) => {
        return ind !== childIndex;
      });
    },
    // // 规格名失去焦点做检验重复校验
    // standardBlur(name) {
    //   console.log(name);
    // },
    // //规格值失去焦点检验重复校验
    // standardValueBlur(name, list) {
    //   console.log(name, list);
    // },
    // 重名校验
    validateName(rule, value, callback, name, index, list) {
      // console.log(name, list);
      let flag = true;
      list.forEach((item, ind) => {
        if (index !== ind && item.name === name) {
          flag = false;
        }
      });
      if (flag) {
        callback();
      } else {
        callback("规格名重复请重新输入");
      }
    },
    // sku算法获取商品列表
    getSkuList(standardsList) {
      let standardsValueList = standardsList.map((item) => {
        let valueList = item.children.map((child) => {
          return child.name;
        });
        return valueList;
      });
      // console.log('--------规格值二位数组', standardsValueList);
      let skuValueList = standardsValueList.reduce(
        (a, b) => {
          let res = [];
          a.forEach((item) => {
            b.forEach((item1) => {
              res.push(item.concat([item1]));
            });
          });
          return res;
        },
        [[]]
      );
      // console.log('---------sku所有情况的skuValueList', skuValueList)
      let skuList = [];
      skuList = skuValueList.map((item, index) => {
        let obj = {};
        item.forEach((item1, index1) => {
          obj[standardsList[index1].name] = item1;
        });
        return {
          ...obj,
          price: 0.01,
          cost: 0.01,
          stock: 99,
        };
      });
      console.log("---------最终的skuList", skuList);
      this.setColumns(standardsValueList);
      return skuList;
    },
    // 根据最新的规格名渲染table列
    setColumns(standardsValueList) {
      let spanArr = standardsValueList.map((item, index) => {
        let number = 1;
        let arr = standardsValueList.slice(index);
        arr.forEach((child) => {
          number *= child.length;
        });
        return number;
      });
      console.log(
        "--------规格值二位数组",
        standardsValueList,
        "--------spanArr数组",
        spanArr
      );
      let frontColumns = this.formData.standardsList.map((item, index) => {
        let rowSpan = spanArr[index + 1];
        if (rowSpan != undefined) {
          return {
            title: item.name,
            dataIndex: index,
            width: 100,
            align: "center",
            customRender: (text, row, index1) => {
              console.log(index1 % rowSpan);
              return {
                children: <span>{row[item.name]}</span>,
                attrs: {
                  rowSpan: index1 % rowSpan === 0 ? rowSpan : 0,
                },
              };
            },
          };
        } else {
          return {
            title: item.name,
            dataIndex: index,
            width: 100,
            align: "center",
            customRender: (text, row, index1) => {
              return {
                children: <span>{row[item.name]}</span>,
              };
            },
          };
        }
      });
      let endColumns = [
        {
          title: "现价",
          dataIndex: "price",
          scopedSlots: { customRender: "price" },
          width: 100,
          align: "center",
        },
        {
          title: "成本",
          dataIndex: "cost",
          scopedSlots: { customRender: "cost" },
          width: 100,
          align: "center",
        },
        {
          title: "库存",
          dataIndex: "stock",
          scopedSlots: { customRender: "stock" },
          width: 100,
          align: "center",
        },
      ];

      this.columns = frontColumns.concat(endColumns);
    },
    // 保存
    save() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          console.log("---------------formData", this.formData, JSON.stringify(this.formData));
        }
      });
    },
  },
};
</script>

<style lang='less' scoped>
.sku {
  background: #fff;
  height: calc(100vh - 80px);
  padding: 10px;
  position: relative;
  overflow: auto;
  .standard-list {
    display: flex;
    flex-wrap: wrap;
    .standard {
      background: #f1f2f5;
      width: 47%;
      padding: 20px;
      margin-bottom: 20px;
      margin-right: 3%;
      position: relative;
    }
  }
  .goods {
    margin-top: 20px;
  }
}
</style>
<style lang="less">
.sku {
  .goods {
    .ant-form-item {
      margin: 0;
      display: flex;
      justify-content: center;
    }
  }
}
</style>
